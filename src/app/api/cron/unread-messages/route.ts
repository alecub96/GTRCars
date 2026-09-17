import { NextResponse } from 'next/server';
import { notifyUnreadP2PMessages } from '@/lib/support';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');
  if (secret && authorization !== Bearer ) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await notifyUnreadP2PMessages();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Notify unread P2P messages cron error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudieron procesar las notificaciones de mensajes' }, { status: 500 });
  }
}
