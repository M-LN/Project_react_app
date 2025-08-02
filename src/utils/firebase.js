// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// ...existing code...

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLyVWTwejirzBnOVKboZIWWJsS5zywTQs",
  authDomain: "task-app-19522.firebaseapp.com",
  projectId: "task-app-19522",
  storageBucket: "task-app-19522.firebasestorage.app",
  messagingSenderId: "417611991447",
  appId: "1:417611991447:web:a8bb5aa9e5318a92ff9cd2",
  measurementId: "G-34HR4GQF3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Analytics (with support check for React Native)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, auth, analytics };