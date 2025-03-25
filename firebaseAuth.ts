import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFgghl1sPBNEUrRmOh-A0Ek1P_F_rs-LE",
    authDomain: "swd392cityscout.firebaseapp.com",
    databaseURL: "https://swd392cityscout-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "swd392cityscout",
    storageBucket: "swd392cityscout.firebasestorage.app",
    messagingSenderId: "229306504531",
    appId: "1:229306504531:web:22f5c52b0bfed885293da6",
    measurementId: "G-03MN2GJFH3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };