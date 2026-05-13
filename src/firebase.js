import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBNc4oKJAAw2YsyztMgwYsWFW5tgg_NEzY",
    authDomain: "templegallery2026.firebaseapp.com",
    projectId: "templegallery2026",
    storageBucket: "templegallery2026.firebasestorage.app",
    messagingSenderId: "784920116300",
    appId: "1:784920116300:web:2ce7c85b47bf2d0a6c08e9",
    measurementId: "G-K89EHDP6SC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);