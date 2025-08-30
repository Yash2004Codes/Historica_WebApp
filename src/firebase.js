// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKS9kPYFKwHNoU2PX1EC6aq-JOB2LD288",
  authDomain: "legendchatweb.firebaseapp.com",
  projectId: "legendchatweb",
  storageBucket: "legendchatweb.firebasestorage.app",
  messagingSenderId: "166979889530",
  appId: "1:166979889530:web:ffd9b54727205c24448ec3",
  measurementId: "G-76TYHEHDK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);        // ✅ Export Auth
export const db = getFirestore(app);     // ✅ Export Firestore
export { analytics };                    // ✅ Export Analytics