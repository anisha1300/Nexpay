import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa18t-pIel8YywMS52sJfiyZLY8bUXHmc",
  authDomain: "fintechwallet-3396c.firebaseapp.com",
  projectId: "fintechwallet-3396c",
  storageBucket: "fintechwallet-3396c.firebasestorage.app",
  messagingSenderId: "1023012590792",
  appId: "1:1023012590792:web:c3ce959c09a052bff9c1fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
