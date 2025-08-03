
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

let app: FirebaseApp;
const allConfigValuesPresent = Object.values(firebaseConfig).every(Boolean);

if (allConfigValuesPresent) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} else {
    console.warn("Firebase config is missing one or more values. Firebase features will be unavailable.");
}

function getFirebaseAuth(): Auth | null {
    if (!allConfigValuesPresent) return null;
    return getAuth(app);
}

function getFirestoreDb(): Firestore | null {
    if (!allConfigValuesPresent) return null;
    return getFirestore(app);
}

const auth = getFirebaseAuth();
const db = getFirestoreDb();

export { app, auth, db, getFirebaseAuth, getFirestoreDb };
