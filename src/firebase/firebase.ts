// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAq--jmUTriEd8kX-quE-CT1xyuIBAbOmE",
    authDomain: "omega-keep-392420.firebaseapp.com",
    projectId: "omega-keep-392420",
    storageBucket: "omega-keep-392420.firebasestorage.app",
    messagingSenderId: "490930282746",
    appId: "1:490930282746:web:383ff1fce8f2e0df926943",
    measurementId: "G-4XVSXKGP4C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
export const db = getFirestore();
export const auth = getAuth(app);