// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuddr67EjKytvIU6TqMN8HxAbM04KGoXY",
  authDomain: "full-stack-f79cd.firebaseapp.com",
  projectId: "full-stack-f79cd",
  storageBucket: "full-stack-f79cd.appspot.com",
  messagingSenderId: "125667985807",
  appId: "1:125667985807:web:e5e44ca3fe62e149b263fa",
  measurementId: "G-4WVWCEYY6D",
};

initializeApp(firebaseConfig);

export const db = getFirestore();
