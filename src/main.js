import {
    uploadMusic,
    getUserMusic,
    deleteMusic
} from './Storage.js';
import {
    login,
    checkAuthState
} from './Auth.js';
import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Get references to the form and its elements
const googleLoginBtn = document.getElementById('google-login-btn');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const repeatBtn = document.getElementById('repeat-btn');

let repeat = false;
let currentPlayingIndex = -1;
let musicFiles = [];

const displayUserMusic = async () => {
    try {
        musicFiles = await getUserMusic();
        const musicList = document.getElementById('music-list');
        const audioPlayer = document.getElementById('audio-player');

        musicList.innerHTML = '';
        musicFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'music-item';
            li.textContent = file.name.split('.')[0];

            // Add a data attribute to store the index
            li.dataset.index = index;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="bi bi-trash display-7 color-primary-dark"></i>';
            deleteBtn.style.transformOrigin = 'center';
            deleteBtn.style.transition = 'all 0.1s ease';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    await deleteMusic(file.name);
                    li.remove();
                    if (audioPlayer.src === file.url) {
                        audioPlayer.src = '';
                    }
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            });
            deleteBtn.addEventListener('mouseover', () => {
                deleteBtn.style.backgroundColor = 'white';
                deleteBtn.style.color = 'black';
                deleteBtn.style.transform = 'translateY(-50%) scale(1.3)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'black';
                deleteBtn.style.color = 'white';
                deleteBtn.style.transform = 'translateY(-50%) scale(1)';
            });
            li.appendChild(deleteBtn);

            li.addEventListener('click', () => {
                playMusic(index);
                updateActiveMusic(index);
            });
            musicList.appendChild(li);
        });
    } catch (error) {
        console.error('Error displaying user music:', error);
    }
};

const updateActiveMusic = (index) => {
    const musicItems = document.querySelectorAll('.music-item');
    musicItems.forEach(item => {
        item.classList.remove('active');
        item.style.transform = 'scale(1)';
        item.style.backgroundColor = '#ccc';

    });
    const activeItem = document.querySelector(`.music-item[data-index="${index}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.style.transform = 'scale(1.05)';
        activeItem.style.transition = 'all 0.6s ease';
        activeItem.style.backgroundColor = 'white';
    }
};

const playMusic = (index) => {
    const audioPlayer = document.getElementById('audio-player');
    currentPlayingIndex = index;
    audioPlayer.src = musicFiles[index].url;
    audioPlayer.play();
    updateActiveMusic(index);
};

const playNextMusic = () => {
    if (currentPlayingIndex < musicFiles.length - 1) {
        playMusic(currentPlayingIndex + 1);
    } else {
        playMusic(0); // Play the first song if it's the last one
    }
};

googleLoginBtn.addEventListener('click', async () => {
    try {
        await login();
        console.log('Login successful!');
        await displayUserMusic();
    } catch (error) {
        console.error('Login failed:', error.message);
    }
});

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (file) {
        try {
            await uploadMusic(file);
            console.log('File uploaded successfully!');
            await displayUserMusic();
        } catch (error) {
            console.error('Upload failed:', error.message);
        }
    } else {
        console.error('No file selected');
    }
});

const auth = getAuth();

const displayUserInfo = (user) => {
    userInfoDiv.innerHTML = `${user.displayName.split(' ')[0]}`;
    logoutBtn.style.display = 'block';
    googleLoginBtn.style.display = 'none'; // Hide the login button
    fileInput.style.display = 'block'; // Show the file input
    uploadBtn.style.display = 'block'; // Show the upload button
};

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out');
        localStorage.removeItem('user');
        window.location.href = 'Login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

checkAuthState().then(user => {
    console.log('User is logged in:', user);
    displayUserInfo(user);
    displayUserMusic();
}).catch(error => {
    console.log('User is not logged in');
    // Show login button, hide logout button and other elements
    googleLoginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    fileInput.style.display = 'none';
    uploadBtn.style.display = 'none';
    userInfoDiv.innerHTML = '';
});

// Initialize the repeat button style
updateRepeatButtonStyle();

// Modify the audio player's 'ended' event listener
const audioPlayer = document.getElementById('audio-player');
audioPlayer.addEventListener('ended', () => {
    if (repeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNextMusic();
    }
});

function updateRepeatButtonStyle() {
    if (repeat) {
        repeatBtn.classList.remove('btn-light');
        repeatBtn.classList.add('btn-dark');
        repeatBtn.innerHTML = '<i class="bi bi-arrow-repeat" style="color: white;"></i>';
    } else {
        repeatBtn.classList.remove('btn-dark');
        repeatBtn.classList.add('btn-light');
        repeatBtn.innerHTML = '<i class="bi bi-repeat" style="color: black;"></i>';
    }
}

repeatBtn.addEventListener('click', () => {
    repeat = !repeat;
    updateRepeatButtonStyle();
});