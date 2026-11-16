import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Placeholder') &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('AIzaSyDemo') &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'gtrcars-app'
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firestoreInstance = getFirestore(appInstance);
  } catch (err) {
    console.warn('Firebase init notice:', err);
  }
}

export const app: FirebaseApp | null = appInstance;
export const db: Firestore | null = firestoreInstance;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined' || !isFirebaseConfigured || !app) return null;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  try {
    return getMessaging(app);
  } catch (err) {
    console.warn('Firebase Messaging not available:', err);
    return null;
  }
}
