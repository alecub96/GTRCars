import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'En GT Cars las cuentas tienen un rol exclusivo y definitivo (Piloto VIP o Propietario).' },
    { status: 400 }
  );
}
