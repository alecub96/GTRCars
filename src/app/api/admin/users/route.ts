import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    await ensureDbSchema().catch(() => {});

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const roleFilter = searchParams.get('role');
    const verificationFilter = searchParams.get('verification');

    const where: any = {};

    if (roleFilter && ['TRAVELER', 'OWNER', 'ADMIN'].includes(roleFilter)) {
      where.role = roleFilter;
    }

    if (verificationFilter && ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'].includes(verificationFilter)) {
      where.verification = verificationFilter;
    }

    if (q) {
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const [users, totalUsers, travelersCount, ownersCount, verifiedCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
          role: true,
          verification: true,
          createdAt: true,
          updatedAt: true,
          stripeCustomerId: true,
          stripeAccountId: true,
          _count: {
            select: {
              vehicles: true,
              bookingsAsTraveler: true,
              bookingsAsOwner: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TRAVELER' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.user.count({ where: { verification: 'VERIFIED' } }),
    ]);

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        avatarUrl: u.avatarUrl || '/default-avatar.svg',
      })),
      metrics: {
        totalUsers,
        travelersCount,
        ownersCount,
        verifiedCount,
      },
    });
  } catch (error: any) {
    console.error('API Admin Users GET Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'Error al listar usuarios' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    await ensureDbSchema().catch(() => {});

    const body = await request.json();
    const { userId, firstName, lastName, email, phone, role, verification, avatarUrl, newPassword, iban, bankHolder } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'ID de usuario no especificado' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (typeof firstName === 'string' && firstName.trim()) {
      dataToUpdate.firstName = firstName.trim();
    }
    if (typeof lastName === 'string' && lastName.trim()) {
      dataToUpdate.lastName = lastName.trim();
    }
    if (typeof email === 'string' && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (emailTaken) {
          return NextResponse.json({ error: 'El correo electrónico ya pertenece a otra cuenta' }, { status: 409 });
        }
        dataToUpdate.email = cleanEmail;
      }
    }
    if (phone !== undefined) {
      dataToUpdate.phone = typeof phone === 'string' && phone.trim() ? phone.trim() : null;
    }
    if (typeof role === 'string' && ['TRAVELER', 'OWNER', 'ADMIN'].includes(role)) {
      dataToUpdate.role = role;
    }
    if (typeof verification === 'string' && ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'].includes(verification)) {
      dataToUpdate.verification = verification;
    }
    if (avatarUrl !== undefined) {
      dataToUpdate.avatarUrl = typeof avatarUrl === 'string' && avatarUrl.trim() ? avatarUrl.trim() : '/default-avatar.svg';
    }
    if (typeof newPassword === 'string' && newPassword.trim().length >= 8) {
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        verification: true,
        updatedAt: true,
      },
    });

    // Si se enviaron datos bancarios, guardarlos mediante SQL seguro
    if (iban !== undefined || bankHolder !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE User SET iban = ?, bankHolder = ? WHERE id = ?`,
        iban || null,
        bankHolder || null,
        userId
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Perfil de «${updatedUser.firstName} ${updatedUser.lastName}» actualizado con éxito.`,
    });
  } catch (error: any) {
    console.error('API Admin Users PATCH Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'No se pudo actualizar el perfil del cliente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario no especificado' }, { status: 400 });
    }

    if (userId === admin.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta de administrador' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Cuenta de usuario eliminada correctamente.',
    });
  } catch (error: any) {
    console.error('API Admin Users DELETE Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'No se pudo eliminar el usuario' }, { status: 500 });
  }
}
