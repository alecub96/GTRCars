import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() { return NextResponse.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' }); }
export async function POST(request: Request) { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 }); const body = await request.json(); if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) return NextResponse.json({ error: 'Suscripción inválida' }, { status: 400 }); await prisma.pushSubscription.upsert({ where: { endpoint: body.endpoint }, update: { userId: user.id, p256dh: body.keys.p256dh, auth: body.keys.auth }, create: { userId: user.id, endpoint: body.endpoint, p256dh: body.keys.p256dh, auth: body.keys.auth } }); return NextResponse.json({ success: true }); }
