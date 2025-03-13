import { messaging, getToken, onMessage } from "../../firebaseMessaging";

export const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !messaging) {
        console.log("Notification not available in this environment");
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("✅ Quyền thông báo đã được cấp");

            // Lấy FCM Token
            const token = await getToken(messaging, {
                vapidKey: "BAiNp2em2GJObbppn5fbmevwqnPMuanJ1VzWcFsTMihR5jk_XjM59kwQgp2SXbbkvF_zo69ClX1AdrjMNuFRhPQ",
            });

            if (token) {
                console.log("🔥 FCM Token:", token);
                // Gửi token này lên server để lưu trữ
            } else {
                console.log("🚫 Không lấy được token.");
            }
        } else {
            console.log("❌ Người dùng từ chối thông báo.");
        }
    } catch (error) {
        console.error("⚠️ Lỗi khi xin quyền thông báo:", error);
    }
};

// Lắng nghe tin nhắn khi ứng dụng đang mở
// export const listenForNotifications = () => {
//     onMessage(messaging, (payload) => {
//         console.log("📩 Nhận được thông báo:", payload);
//         new Notification(payload.notification?.title || "Thông báo", {
//             body: payload.notification?.body,
//             icon: "/logo.png",
//         });
//     });
// };
export const listenForNotifications = () => {
    if (typeof window === "undefined" || !messaging) {
        return;
    }
    onMessage(messaging, (payload) => {
        console.log("📩 Nhận được thông báo:", payload);

        // Hiển thị thông báo trên trình duyệt
        if (Notification.permission === "granted") {
            new Notification(payload.notification?.title || "Thông báo", {
                body: payload.notification?.body,
                icon: "/logo.png", // Thay icon của bạn
            });
        }
    });
};