import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

/**
 * POST /api/payments/deposit
 * Solo aplica cuando GTR Cars gestiona la fianza (vehicle.ownershipType === 'PLATFORM').
 * Modalidades:
 *  - 'STRIPE_HOLD': Preautorización / Retención temporal en tarjeta (capture_method: 'manual') para desbloquear después.
 *  - 'BANK_TRANSFER': Notificación de transferencia bancaria con referencia/comprobante para verificación de GTR Cars.
 */
export async function POST(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, method = 'STRIPE_HOLD', transferReference = '', transferHolder = '' } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        traveler: true,
        contract: true,
        payments: {
          where: { type: { in: ['DEPOSIT_HOLD', 'DEPOSIT_TRANSFER'] } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    if (booking.travelerId !== sessionUser.id && sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado para gestionar la fianza de esta reserva' }, { status: 403 });
    }

    // Regla de negocio: Solo cuando GTR Cars gestiona la fianza (ownershipType === 'PLATFORM')
    if (booking.vehicle.ownershipType !== 'PLATFORM') {
      return NextResponse.json(
        {
          error:
            'En este vehículo la fianza la gestiona directamente el propietario en la entrega, por lo que no requiere retención en plataforma.',
        },
        { status: 409 }
      );
    }

    if (booking.depositAmount <= 0) {
      return NextResponse.json({ error: 'Esta reserva no requiere fianza' }, { status: 409 });
    }

    if (['HELD', 'RELEASED'].includes(booking.depositStatus)) {
      return NextResponse.json({ error: 'La fianza de esta reserva ya está retenida o procesada' }, { status: 409 });
    }

    // MODALIDAD 1: TRANSFERENCIA BANCARIA CON VERIFICACIÓN DE COMPROBANTE
    if (method === 'BANK_TRANSFER') {
      const refClean = String(transferReference || '').trim();
      const holderClean = String(transferHolder || '').trim();
      if (refClean.length < 4) {
        return NextResponse.json(
          { error: 'Indica el número de referencia o justificante de la transferencia realizada.' },
          { status: 400 }
        );
      }

      let existingSnapshot: any = {};
      try {
        if (booking.contract?.termsSnapshot) {
          existingSnapshot = JSON.parse(booking.contract.termsSnapshot);
        }
      } catch {}

      const depositTransferInfo = {
        method: 'BANK_TRANSFER',
        reference: refClean,
        holder: holderClean || `${booking.traveler.firstName} ${booking.traveler.lastName}`,
        amount: booking.depositAmount,
        notifiedAt: new Date().toISOString(),
        status: 'PENDING_VERIFICATION',
      };

      await prisma.$transaction([
        prisma.payment.create({
          data: {
            bookingId: booking.id,
            stripeId: `trf_deposit_${booking.code}_${Date.now()}`,
            amount: booking.depositAmount,
            currency: 'EUR',
            status: 'PENDING_VERIFICATION',
            type: 'DEPOSIT_TRANSFER',
          },
        }),
        prisma.booking.update({
          where: { id: booking.id },
          data: { depositStatus: 'PENDING' },
        }),
        prisma.contract.upsert({
          where: { bookingId: booking.id },
          update: {
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: depositTransferInfo,
            }),
          },
          create: {
            bookingId: booking.id,
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: depositTransferInfo,
            }),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        mode: 'BANK_TRANSFER',
        message:
          'Justificante de transferencia de fianza registrado. Administración verificará la recepción y marcará la fianza como retenida.',
      });
    }

    // MODALIDAD 2: RETENCIÓN TEMPORAL EN TARJETA VÍA STRIPE (capture_method: 'manual')
    if (stripeSecretKey && !stripeSecretKey.includes('mock')) {
      const stripe = new Stripe(stripeSecretKey);

      let customerId = booking.traveler.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: booking.traveler.email,
          name: `${booking.traveler.firstName} ${booking.traveler.lastName}`,
        });
        customerId = customer.id;
        await prisma.user.update({
          where: { id: booking.traveler.id },
          data: { stripeCustomerId: customerId },
        });
      }

      const depositCents = Math.round(booking.depositAmount * 100);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gtrcars.es';

      const checkout = await stripe.checkout.sessions.create({
        mode: 'payment',
        ui_mode: 'elements',
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: depositCents,
              product_data: {
                name: `Retención de Fianza Reembolsable — ${booking.code}`,
                description: `Bloqueo temporal de garantía para ${booking.vehicle.title} (se desbloquea tras el alquiler)`,
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          capture_method: 'manual', // Retención / Preautorización sin cobro definitivo hasta captura
          metadata: {
            bookingId: booking.id,
            bookingCode: booking.code,
            paymentKind: 'SECURITY_DEPOSIT_HOLD',
          },
        },
        metadata: {
          bookingId: booking.id,
          bookingCode: booking.code,
          paymentKind: 'SECURITY_DEPOSIT_HOLD',
        },
        return_url: `${appUrl}/reserva/${booking.id}?fianza=retenida&session_id={CHECKOUT_SESSION_ID}`,
      });

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripeId: checkout.id,
          amount: booking.depositAmount,
          currency: 'EUR',
          status: 'PENDING',
          type: 'DEPOSIT_HOLD',
        },
      });

      return NextResponse.json({
        success: true,
        mode: 'STRIPE_ELEMENTS',
        clientSecret: checkout.client_secret,
      });
    }

    return NextResponse.json(
      { error: 'La pasarela de retención con tarjeta no está disponible en este momento.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Deposit hold error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo procesar la operación de fianza' }, { status: 500 });
  }
}

/**
 * PATCH /api/payments/deposit
 * Acciones de verificación, retención y desbloqueo de fianza por GTR Cars (ADMIN):
 *  - 'verify-hold': Confirma que la fianza (transferencia o tarjeta) está verificada y retenida (HELD).
 *  - 'release-deposit': Desbloquea y libera el 100% de la fianza retenida al finalizar el alquiler (RELEASED).
 *  - 'capture-deposit': Ejecuta un cargo parcial o total sobre la fianza retenida en caso de daños/km (PARTIALLY_CHARGED / CHARGED).
 *  - 'toggle-management': Cambia si la fianza del vehículo la gestiona GTR Cars (PLATFORM) o el propietario (THIRD_PARTY).
 */
export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Solo administración de GTR Cars puede verificar o desbloquear fianzas custodiadas' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, action, captureAmount, reason = '' } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        contract: true,
        payments: {
          where: { type: { in: ['DEPOSIT_HOLD', 'DEPOSIT_TRANSFER'] } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    if (action === 'toggle-management') {
      const nextOwnership = booking.vehicle.ownershipType === 'PLATFORM' ? 'THIRD_PARTY' : 'PLATFORM';
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { ownershipType: nextOwnership },
      });
      return NextResponse.json({
        success: true,
        ownershipType: nextOwnership,
        message:
          nextOwnership === 'PLATFORM'
            ? 'Activada gestión y verificación de fianza por GTR Cars.'
            : 'Fianza configurada como gestión directa por el propietario.',
      });
    }

    let existingSnapshot: any = {};
    try {
      if (booking.contract?.termsSnapshot) {
        existingSnapshot = JSON.parse(booking.contract.termsSnapshot);
      }
    } catch {}

    const latestDepositPayment = booking.payments[0];

    // 1. VERIFICAR Y MARCAR FIANZA COMO RETENIDA (HELD)
    if (action === 'verify-hold') {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { depositStatus: 'HELD' },
        }),
        ...(latestDepositPayment
          ? [
              prisma.payment.update({
                where: { id: latestDepositPayment.id },
                data: { status: 'HELD' },
              }),
            ]
          : []),
        prisma.contract.upsert({
          where: { bookingId: booking.id },
          update: {
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                ...(existingSnapshot.depositVerification || {}),
                status: 'HELD',
                verifiedBy: admin.email,
                verifiedAt: new Date().toISOString(),
              },
            }),
          },
          create: {
            bookingId: booking.id,
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                status: 'HELD',
                verifiedBy: admin.email,
                verifiedAt: new Date().toISOString(),
              },
            }),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        depositStatus: 'HELD',
        message: 'Fianza verificada y marcada como RETENIDA EN CUSTODIA.',
      });
    }

    // 2. DESBLOQUEAR / LIBERAR FIANZA (RELEASED)
    if (action === 'release-deposit') {
      if (stripeSecretKey && !stripeSecretKey.includes('mock') && latestDepositPayment?.stripeId) {
        const stripe = new Stripe(stripeSecretKey);
        try {
          if (latestDepositPayment.stripeId.startsWith('cs_')) {
            const session = await stripe.checkout.sessions.retrieve(latestDepositPayment.stripeId);
            const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
            if (piId) {
              const pi = await stripe.paymentIntents.retrieve(piId);
              if (pi.status === 'requires_capture') {
                // Cancela la preautorización y desbloquea el saldo en la tarjeta del cliente al instante
                await stripe.paymentIntents.cancel(piId);
              } else if (pi.status === 'succeeded') {
                await stripe.refunds.create({ payment_intent: piId });
              }
            }
          } else if (latestDepositPayment.stripeId.startsWith('pi_')) {
            const pi = await stripe.paymentIntents.retrieve(latestDepositPayment.stripeId);
            if (pi.status === 'requires_capture') {
              await stripe.paymentIntents.cancel(pi.id);
            } else if (pi.status === 'succeeded') {
              await stripe.refunds.create({ payment_intent: pi.id });
            }
          }
        } catch (stripeErr) {
          console.warn('Stripe deposit release notice:', stripeErr);
        }
      }

      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { depositStatus: 'RELEASED' },
        }),
        ...(latestDepositPayment
          ? [
              prisma.payment.update({
                where: { id: latestDepositPayment.id },
                data: { status: 'RELEASED' },
              }),
            ]
          : []),
        prisma.contract.upsert({
          where: { bookingId: booking.id },
          update: {
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                ...(existingSnapshot.depositVerification || {}),
                status: 'RELEASED',
                releasedBy: admin.email,
                releasedAt: new Date().toISOString(),
              },
            }),
          },
          create: {
            bookingId: booking.id,
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                status: 'RELEASED',
                releasedBy: admin.email,
                releasedAt: new Date().toISOString(),
              },
            }),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        depositStatus: 'RELEASED',
        message: 'Fianza desbloqueada y liberada al 100% a favor del cliente.',
      });
    }

    // 3. CAPTURAR / RETENER IMPORTE DE FIANZA POR INCIDENCIA O DAÑOS
    if (action === 'capture-deposit') {
      const amountToCharge = Number(captureAmount) || booking.depositAmount;
      const isPartial = amountToCharge < booking.depositAmount;
      const nextStatus = isPartial ? 'PARTIALLY_CHARGED' : 'CHARGED';

      if (stripeSecretKey && !stripeSecretKey.includes('mock') && latestDepositPayment?.stripeId) {
        const stripe = new Stripe(stripeSecretKey);
        try {
          let piId: string | null = null;
          if (latestDepositPayment.stripeId.startsWith('cs_')) {
            const session = await stripe.checkout.sessions.retrieve(latestDepositPayment.stripeId);
            piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null;
          } else if (latestDepositPayment.stripeId.startsWith('pi_')) {
            piId = latestDepositPayment.stripeId;
          }
          if (piId) {
            const pi = await stripe.paymentIntents.retrieve(piId);
            if (pi.status === 'requires_capture') {
              await stripe.paymentIntents.capture(piId, {
                amount_to_capture: Math.round(amountToCharge * 100),
              });
            }
          }
        } catch (stripeErr) {
          console.warn('Stripe deposit capture notice:', stripeErr);
        }
      }

      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { depositStatus: nextStatus },
        }),
        ...(latestDepositPayment
          ? [
              prisma.payment.update({
                where: { id: latestDepositPayment.id },
                data: { status: nextStatus, amount: amountToCharge },
              }),
            ]
          : []),
        prisma.contract.upsert({
          where: { bookingId: booking.id },
          update: {
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                ...(existingSnapshot.depositVerification || {}),
                status: nextStatus,
                capturedAmount: amountToCharge,
                captureReason: reason,
                capturedBy: admin.email,
                capturedAt: new Date().toISOString(),
              },
            }),
          },
          create: {
            bookingId: booking.id,
            termsSnapshot: JSON.stringify({
              ...existingSnapshot,
              depositVerification: {
                status: nextStatus,
                capturedAmount: amountToCharge,
                captureReason: reason,
                capturedBy: admin.email,
                capturedAt: new Date().toISOString(),
              },
            }),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        depositStatus: nextStatus,
        message: `Se han ejecutado ${amountToCharge} € de la fianza (${isPartial ? 'el resto queda desbloqueado' : '100%'}).`,
      });
    }

    return NextResponse.json({ error: 'Acción de fianza no reconocida' }, { status: 400 });
  } catch (error) {
    console.error('Deposit PATCH error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al actualizar el estado de la fianza' }, { status: 500 });
  }
}
