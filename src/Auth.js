import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCW6h7uq9YZNQV0R3u4rIGCJhUOwca6OL8",
    authDomain: "music-player-76bce.firebaseapp.com",
    projectId: "music-player-76bce",
    storageBucket: "music-player-76bce.appspot.com",
    messagingSenderId: "435907873444",
    appId: "1:435907873444:web:e2144f0ba28a8165e23431",
    measurementId: "G-3BWYE4T93F"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Log in user
export const login = () => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User logged in with Google:', user.uid);
        console.log('User details:', user.displayName, user.email);
        
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        }));
        
        // Redirect to index.html
        window.location.href = 'index.html';
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error logging in with Google:', errorCode, errorMessage);
      });
};

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not logged in'));
      }
    });
  });
};