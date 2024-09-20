// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW6h7uq9YZNQV0R3u4rIGCJhUOwca6OL8",
  authDomain: "music-player-76bce.firebaseapp.com",
  projectId: "music-player-76bce",
  storageBucket: "music-player-76bce.appspot.com",
  messagingSenderId: "435907873444",
  appId: "1:435907873444:web:e2144f0ba28a8165e23431",
  measurementId: "G-3BWYE4T93F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);