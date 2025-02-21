"use client";
// import "./globals.css";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Navbar from "@/components/Navbar/index";
import Footer from "@/components/Footer/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    // const pathname = usePathname();

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                {/* <Navbar /> */}
                {/* {children} */}
                <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    {loading ? <Loader /> : children}
                </div>
            </body>
        </html>
    );
}
