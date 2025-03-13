"use client";
import React, { useEffect, useState } from "react";
import Navbarin from "@/components/Navbar/index";


export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);

    // useEffect(() => {
    //     // if (sessionStorage.getItem("token")) {
    //     //     setIsLogin(true);
    //     // }
    //     setIsLogin(!!sessionStorage.getItem("token"));
    // }, []);

    const checkLoginStatus = () => {
        setIsLogin(!!sessionStorage.getItem("token"));
    };

    useEffect(() => {
        checkLoginStatus(); // Run on component mount

        // Listen for changes in sessionStorage
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "token") {
                checkLoginStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Handle same-tab changes using a custom event
    useEffect(() => {
        const handleSessionUpdate = () => checkLoginStatus();

        window.addEventListener("sessionUpdate", handleSessionUpdate);

        return () => {
            window.removeEventListener("sessionUpdate", handleSessionUpdate);
        };
    }, []);


    if (isLogin === null) return null;


    return (
        // <html lang="en">
        // <body suppressHydrationWarning={true}>
        <div>
            <Navbarin isLogin={isLogin} />
            {children}
        </div>
        // </body>
        // </html>
    );
}