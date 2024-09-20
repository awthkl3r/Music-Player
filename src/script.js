import {
    checkAuthState
} from './Auth.js';

const init = async () => {
    try {
        const user = await checkAuthState();
        if (!window.location.pathname.endsWith('/index.html')) {
            window.location.href = '/index.html';
        }
        console.log('User is already logged in, redirecting to index page');

    } catch (error) {
        console.log('User is not logged in');
        if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = '/src/Login.html';
        }
    }
};

window.addEventListener('load', init);