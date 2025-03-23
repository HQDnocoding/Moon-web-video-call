// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpghMO7nSY1kcuZMJkTUo0pB1xGvoHKzM",
  authDomain: "moonice-video-call.firebaseapp.com",
  databaseURL: "https://moonice-video-call-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moonice-video-call",
  storageBucket: "moonice-video-call.firebasestorage.app",
  messagingSenderId: "952269846258",
  appId: "1:952269846258:web:b750d909d241c80482826b",
  measurementId: "G-KW1WJ382TE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database=getDatabase(app)
console.log("concaconcua🔥 Firebase initialized:", app.name);
export {app,database}