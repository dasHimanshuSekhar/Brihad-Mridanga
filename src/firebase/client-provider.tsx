'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseContextValue = useMemo(() => {
    const { app, firestore, auth } = initializeFirebase();
    return { app, firestore, auth };
  }, []);

  return (
    <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>
  );
}
