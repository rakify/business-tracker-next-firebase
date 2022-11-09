import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0R6yc4I5Qf7szfOl0_MwJLR3DGFavieI",
  authDomain: "business-33109.firebaseapp.com",
  databaseURL: "https://business-33109-default-rtdb.firebaseio.com",
  projectId: "business-33109",
  storageBucket: "business-33109.appspot.com",
  messagingSenderId: "625494165714",
  appId: "1:625494165714:web:f94526641a9c9db703c50b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};