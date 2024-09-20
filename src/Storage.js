import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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
// Initialize Firebase storage
const storage = getStorage(app);

// Function to upload a music file
export const uploadMusic = (file) => {
    const user = auth.currentUser;
    
    if (user) {
        const userId = user.uid;
        const storageRef = ref(storage, `music/${userId}/${file.name}`);
        
        return uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded music file successfully:', snapshot);
        }).catch(error => {
            console.error('Error uploading music file:', error.message);
            throw error;
        });
    } else {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
    }
};

// Function to retrieve the user's music files
export const getUserMusic = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const listRef = ref(storage, `music/${user.uid}`);
    try {
        const result = await listAll(listRef);
        const musicFiles = await Promise.all(result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { name: item.name, url: url };
        }));
        return musicFiles;
    } catch (error) {
        console.error('Error getting user music:', error);
        throw error;
    }
};

// Function to delete a music file
export const deleteMusic = async (fileName) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const fileRef = ref(storage, `music/${user.uid}/${fileName}`);
    try {
        await deleteObject(fileRef);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};