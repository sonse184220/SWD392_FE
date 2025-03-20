"use client";
// import "./globals.css";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const pathname = usePathname();

    // const pathname = usePathname();

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    useEffect(() => {
        if (pathname.startsWith("/admin")) {
            document.documentElement.classList.add("dark"); // ✅ Apply dark mode only for admin routes
        } else {
            document.documentElement.classList.remove("dark"); // ✅ Remove dark mode for non-admin routes
        }

        return () => {
            document.documentElement.classList.remove("dark"); // Cleanup when leaving admin routes
        };
    }, [pathname]);

    return (
        <div className="dark:bg-gray-900 dark:text-white min-h-screen">
            {loading ? <Loader /> : children}
        </div>
    );
}
