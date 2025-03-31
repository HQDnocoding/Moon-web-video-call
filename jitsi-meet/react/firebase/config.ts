

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
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
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const database: Database = getDatabase(app);

console.log("concaconcua🔥 Firebase initialized:", app.name);

export { app, database };