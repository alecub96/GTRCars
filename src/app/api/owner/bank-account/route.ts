import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET() {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo propietarios' }, { status: 403 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { iban: true, bankHolder: true, stripeAccountId: true },
    });

    return NextResponse.json({
      success: true,
      iban: userData?.iban || '',
      bankHolder: userData?.bankHolder || '',
      configured: Boolean(userData?.iban || userData?.stripeAccountId),
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al consultar la cuenta bancaria' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los propietarios pueden configurar IBAN de cobro' }, { status: 403 });
    }

    const body = await request.json();
    const { iban, bankHolder } = body;

    const rawIban = typeof iban === 'string' ? iban.replace(/\s+/g, '').toUpperCase() : '';
    const cleanHolder = typeof bankHolder === 'string' ? bankHolder.trim() : '';

    if (!rawIban || rawIban.length < 15 || rawIban.length > 34) {
      return NextResponse.json({ error: 'Introduce un código IBAN válido (ejemplo: ES91 2100 0418 4502 0000 1234)' }, { status: 400 });
    }

    if (!cleanHolder || cleanHolder.length < 3) {
      return NextResponse.json({ error: 'Introduce el nombre y apellidos completos del titular de la cuenta' }, { status: 400 });
    }

    // Formatear IBAN con bloques de 4 caracteres
    const formattedIban = rawIban.match(/.{1,4}/g)?.join(' ') || rawIban;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        iban: formattedIban,
        bankHolder: cleanHolder,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cuenta bancaria e IBAN guardados correctamente',
      iban: formattedIban,
      bankHolder: cleanHolder,
    });
  } catch (error) {
    console.error('Save IBAN Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo guardar los datos bancarios' }, { status: 500 });
  }
}
