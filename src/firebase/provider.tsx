'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, useContext, ReactNode } from 'react';

export interface FirebaseContextValue {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = () => {
  return useContext(FirebaseContext)?.app;
}

export const useFirestore = () => {
  return useContext(FirebaseContext)?.firestore;
};

export const useAuth = () => {
  return useContext(FirebaseContext)?.auth;
};

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextValue | null;
}) {
  if (!value) {
    return <>{children}</>;
  }
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
