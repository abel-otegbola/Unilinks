// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAha2jy4MiB_BLNJggLerw3FsE2ps3_W2s",
    authDomain: "unilinks-a06b1.firebaseapp.com",
    projectId: "unilinks-a06b1",
    storageBucket: "unilinks-a06b1.firebasestorage.app",
    messagingSenderId: "609709144714",
    appId: "1:609709144714:web:92e06f79d8888e67d68b73",
    measurementId: "G-9W22MWF4JD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
export const db = getFirestore();
export const auth = getAuth(app);
export const storage = getStorage(app);