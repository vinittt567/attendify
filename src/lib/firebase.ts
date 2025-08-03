
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    !firebaseConfig.appId
  ) {
    console.error("Firebase config is not set. Please check your .env file.");
    return;
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

// Call initialization
initializeFirebase();

// Export functions to get the instances
export const getFirebaseApp = () => {
  if (!app) initializeFirebase();
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth) initializeFirebase();
  return auth;
};

export const getFirestoreDb = () => {
  if (!db) initializeFirebase();
  return db;
};
