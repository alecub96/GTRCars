import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function admin() { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 }); if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 }); return null; }
export async function GET() { const error = await admin(); if (error) return error; const incidents = await prisma.incident.findMany({ include: { booking: { select: { code: true, totalAmount: true, vehicle: { select: { title: true } }, traveler: { select: { firstName: true, lastName: true } }, owner: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'desc' } }); return NextResponse.json({ success: true, incidents }); }
export async function PATCH(request: Request) { const error = await admin(); if (error) return error; const { incidentId, status, resolution } = await request.json(); if (!incidentId || !['UNDER_REVIEW','RESOLVED','REJECTED'].includes(status)) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 }); const incident = await prisma.incident.update({ where: { id: incidentId }, data: { status, resolution } }); return NextResponse.json({ success: true, incident }); }
