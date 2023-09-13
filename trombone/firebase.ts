

import { initializeApp, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCOOPCQEJvRVbo_gY6Ummyv_9OA5QaO6wo",
  authDomain: "trombone-chat.firebaseapp.com",
  projectId: "trombone-chat",
  storageBucket: "trombone-chat.appspot.com",
  messagingSenderId: "160274602744",
  appId: "1:160274602744:web:406f17587d6695b218b90d",
  measurementId: "G-ZLWGDN3W48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export { app, db, auth };
