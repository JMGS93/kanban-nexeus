import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAt9zCGP19etDuHx6Wr7iCmNVNaAQJEdeY",
  authDomain: "kanban-nexeus.firebaseapp.com",
  projectId: "kanban-nexeus",
  storageBucket: "kanban-nexeus.firebasestorage.app",
  messagingSenderId: "105629778633",
  appId: "1:105629778633:web:741833647f6a3b13e04318",
  measurementId: "G-910KW8CD2G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);