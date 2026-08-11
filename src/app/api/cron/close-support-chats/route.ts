import { NextResponse } from 'next/server';
import { closeInactiveSupportChats } from '@/lib/support';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await closeInactiveSupportChats();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Close support chats cron error:', error);
    return NextResponse.json({ error: 'No se pudieron cerrar los chats inactivos' }, { status: 500 });
  }
}
