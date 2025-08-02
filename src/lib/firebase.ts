// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "attendify-dv4c8",
  "appId": "1:769171752484:web:0fcbb6a1a05f5530b9fab1",
  "storageBucket": "attendify-dv4c8.firebasestorage.app",
  "apiKey": "AIzaSyChuV-xIQtmZk80bfvrx4rOF4FxUV_ev1o",
  "authDomain": "attendify-dv4c8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "769171752484"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
