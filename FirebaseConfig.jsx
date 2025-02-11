// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI2cIy_bsWvj3hmy0ISY96TWpOjWDumsk",
  authDomain: "c-mex-b0ef4.firebaseapp.com",
  projectId: "c-mex-b0ef4",
  storageBucket: "c-mex-b0ef4.firebasestorage.app",
  messagingSenderId: "179701224462",
  appId: "1:179701224462:web:016c767712b4f4117f985f",
  measurementId: "G-WJMH1R4C46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };