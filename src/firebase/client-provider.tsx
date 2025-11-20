'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebase, setFirebase] = useState(initializeFirebase());

  // This ensures that Firebase is initialized only once on the client
  useEffect(() => {
    if (!firebase) {
      setFirebase(initializeFirebase());
    }
  }, [firebase]);

  if (!firebase.firebaseApp) {
    return <div>Loading...</div>; // Or a proper loader
  }

  return (
    <FirebaseProvider value={firebase}>
      {children}
    </FirebaseProvider>
  );
};
