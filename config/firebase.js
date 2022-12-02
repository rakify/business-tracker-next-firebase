// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjChAp4r5pejQUzh4W0ofMW571qCJCL4c",
  authDomain: "business-tracker-1ce3b.firebaseapp.com",
  projectId: "business-tracker-1ce3b",
  storageBucket: "business-tracker-1ce3b.appspot.com",
  messagingSenderId: "448339148635",
  appId: "1:448339148635:web:99774d10e35a742a01247e",
  measurementId: "G-BRHVBMF1PF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
