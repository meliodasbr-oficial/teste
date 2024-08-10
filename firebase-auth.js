// firebase-auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDr27BIHswRcTvvE5lUpR-l4OMGwGFQQaw",
    authDomain: "meliodaslogin-bae06.firebaseapp.com",
    projectId: "meliodaslogin-bae06",
    storageBucket: "meliodaslogin-bae06.appspot.com",
    messagingSenderId: "292569281051",
    appId: "1:292569281051:web:473895afda6419bc747ebe",
    measurementId: "G-3N0G8EFNMV"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Referências aos formulários e botões
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const googleLoginBtn = document.getElementById('google-login');
const facebookLoginBtn = document.getElementById('facebook-login');

// Manipuladores de evento para o formulário de registro
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário registrado: ', user);
            // Redirecionar ou lidar com o usuário registrado
        })
        .catch((error) => {
            console.error('Erro ao registrar: ', error);
        });
});

// Manipuladores de evento para o formulário de login
signinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário logado: ', user);
            // Redirecionar ou lidar com o usuário logado
        })
        .catch((error) => {
            console.error('Erro ao fazer login: ', error);
        });
});

// Manipuladores de evento para o login com Google
const googleProvider = new GoogleAuthProvider();

googleLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            console.log('Usuário logado com Google: ', user);
            // Redirecionar ou lidar com o usuário logado
        })
        .catch((error) => {
            console.error('Erro ao fazer login com Google: ', error);
        });
});

// Manipuladores de evento para o login com Facebook
const facebookProvider = new FacebookAuthProvider();

facebookLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            const user = result.user;
            console.log('Usuário logado com Facebook: ', user);
            // Redirecionar ou lidar com o usuário logado
        })
        .catch((error) => {
            console.error('Erro ao fazer login com Facebook: ', error);
        });
});
