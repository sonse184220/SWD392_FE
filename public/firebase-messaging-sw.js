importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

// Cấu hình Firebase (Sử dụng cấu hình của bạn)
const firebaseConfig = {
    apiKey: "AIzaSyBFgghl1sPBNEUrRmOh-A0Ek1P_F_rs-LE",
    authDomain: "swd392cityscout.firebaseapp.com",
    projectId: "swd392cityscout",
    storageBucket: "swd392cityscout.firebasestorage.app",
    messagingSenderId: "229306504531",
    appId: "1:229306504531:web:22f5c52b0bfed885293da6",
    measurementId: "G-03MN2GJFH3"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Xử lý thông báo khi nhận được ở background
messaging.onBackgroundMessage((payload) => {
    console.log("📩 Nhận thông báo ở chế độ nền:", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
    });
});
