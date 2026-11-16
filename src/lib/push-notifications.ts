import { adminMessaging } from './firebase-admin';

interface SendPushNotificationParams {
  token?: string;
  tokens?: string[];
  title: string;
  body: string;
  url?: string;
  data?: Record<string, string>;
}

export async function sendPushNotification({
  token,
  tokens = [],
  title,
  body,
  url = '/mensajes',
  data = {},
}: SendPushNotificationParams) {
  if (!adminMessaging) {
    console.warn('Firebase adminMessaging no inicializado.');
    return { success: false, reason: 'Firebase not configured' };
  }

  const targetTokens = token ? [token, ...tokens] : tokens;
  const uniqueTokens = Array.from(new Set(targetTokens.filter(Boolean)));

  if (!uniqueTokens.length) {
    return { success: false, reason: 'No tokens provided' };
  }

  try {
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        url,
        ...data,
      },
      webpush: {
        fcmOptions: {
          link: url,
        },
        notification: {
          icon: '/brand/app-icon.png',
          badge: '/brand/app-icon.png',
        },
      },
    };

    if (uniqueTokens.length === 1) {
      const response = await adminMessaging.send({
        token: uniqueTokens[0],
        ...payload,
      });
      return { success: true, messageId: response };
    }

    const response = await adminMessaging.sendEachForMulticast({
      tokens: uniqueTokens,
      ...payload,
    });
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Error enviando notificación Push Firebase:', error);
    return { success: false, error };
  }
}
