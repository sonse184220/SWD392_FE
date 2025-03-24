"use client";
import React, { useEffect, useState } from "react";
import Navbarin from "@/components/Navbar/index";
import { usePathname } from "next/navigation";


export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [isLogin, setIsLogin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    useEffect(() => {
        // ✅ Set loading true whenever route changes
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 1000);

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, [pathname]);


    if (isLogin === null) return null;


    return (
        // <html lang="en">
        // <body suppressHydrationWarning={true}>
        <div>
            <Navbarin isLogin={isLogin} />
            {/* {children} */}
            {/* {loading ? <span className="loading loading-ring loading-xl"></span> : children} */}

            {/* <span className="w-20 h-20 loading loading-ring"></span> */}
            {loading ?
                <div className="flex h-screen items-center justify-center bg-white">
                    <span className="w-20 h-20 loading loading-ring"></span>
                </div>
                : children}

        </div>
        // </body>
        // </html>
    );
}