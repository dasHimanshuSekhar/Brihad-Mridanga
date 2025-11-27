import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// This guard is needed to prevent re-initializing the app in Next.js hot-reloading environment
const apps = getApps();
if (!apps.length) {
    initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
}

const firestore = getFirestore();
const auth = getAuth();

export async function initializeAdmin() {
  return { firestore, auth };
}
