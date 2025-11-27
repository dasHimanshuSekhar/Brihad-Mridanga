
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

export async function initializeAdmin() {
  const apps = getApps();
  if (!apps.length) {
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // In some environments, the SDK can auto-discover credentials.
      initializeApp();
    }
  }
  
  const adminApp = getApp();
  const adminAuth = getAuth(adminApp);
  const adminFirestore = getFirestore(adminApp);

  return { firestore: adminFirestore, auth: adminAuth };
}
