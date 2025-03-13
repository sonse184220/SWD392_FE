import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseMessagingConfig = {
    apiKey: "AIzaSyBFgghl1sPBNEUrRmOh-A0Ek1P_F_rs-LE",
    authDomain: "swd392cityscout.firebaseapp.com",
    projectId: "swd392cityscout",
    storageBucket: "swd392cityscout.firebasestorage.app",
    messagingSenderId: "229306504531",
    appId: "1:229306504531:web:22f5c52b0bfed885293da6",
    measurementId: "G-03MN2GJFH3"
};

let messaging: Messaging | null = null;


if (typeof window !== "undefined") {

    // Khởi tạo Firebase App cho Notifications
    const messagingApp = initializeApp(firebaseMessagingConfig, "messagingApp");
    messaging = getMessaging(messagingApp);

    // Đăng ký service worker từ `/firebase-messaging-sw.js`
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("✅ Service Worker đăng ký thành công:", registration);
            })
            .catch((error) => {
                console.error("❌ Lỗi đăng ký Service Worker:", error);
            });
    }
}

export { messaging, getToken, onMessage };