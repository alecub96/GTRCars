import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | null = null;

if (!getApps().length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gtrcars-app',
      });
    }
  } catch (error) {
    console.warn('Firebase Admin init warning:', error);
  }
} else {
  app = getApps()[0];
}

export const adminMessaging: Messaging | null = app ? getMessaging(app) : null;
export const adminFirestore: Firestore | null = app ? getFirestore(app) : null;
export { app };
