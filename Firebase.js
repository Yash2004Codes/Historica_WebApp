// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDKS9kPYFKwHNoU2PX1EC6aq-JOB2LD288",
  authDomain: "LegendChatWeb.firebaseapp.com",
  projectId: "legendchatweb",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "166979889530",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
