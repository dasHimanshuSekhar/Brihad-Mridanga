import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// If using .json file in same folder:
const serviceAccount = require('./serviceAccountKey.json');

// Initialize admin app once
const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as any),
      })
    : getApps()[0];

export const adminDb = getFirestore(app, 'b-mridanga');
export const adminAuth = getAuth(app);
export { app as adminApp };
