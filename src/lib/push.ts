import webpush from 'web-push';
import { prisma } from '@/lib/prisma';
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
if (publicKey && privateKey) webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:contacto@vaneando.com', publicKey, privateKey);
export async function sendPushToUser(userId: string, title: string, body: string, url: string) {
  if (!publicKey || !privateKey) return;
  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
  await Promise.all(subscriptions.map(async (s) => { try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title, body, url })); } catch (error: unknown) { if (typeof error === 'object' && error && 'statusCode' in error && (error as { statusCode?: number }).statusCode === 410) await prisma.pushSubscription.delete({ where: { id: s.id } }); else console.error('Push notification error:', error); } }));
}

export async function sendPushToAdmins(title: string, body: string, url: string) {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
  await Promise.all(admins.map((admin) => sendPushToUser(admin.id, title, body, url)));
}
