// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-ccf1e.firebaseapp.com",
  projectId: "realestate-ccf1e",
  storageBucket: "realestate-ccf1e.appspot.com",
  messagingSenderId: "2346091226",
  appId: "1:2346091226:web:dd53921aabba1e24775be3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);