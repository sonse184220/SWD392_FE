import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAn4UGnQBkY0jhssiu_BFG5KbwVTjAYTxk",
    authDomain: "swd392-fe.firebaseapp.com",
    projectId: "swd392-fe",
    storageBucket: "swd392-fe.firebasestorage.app",
    messagingSenderId: "1080828748921",
    appId: "1:1080828748921:web:61c627f87b6616095560a8",
    measurementId: "G-389Q3KLJ2C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };