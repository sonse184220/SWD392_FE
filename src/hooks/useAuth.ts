// // hooks/useAuth.ts
// "use client";

// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//     nameid: string;
//     email: string;
//     unique_name: string;
//     role: string;
// }

// export function useAuth() {
//     const [token, setToken] = useState<string | null>(null);
//     const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Only run on client side
//         // if (typeof window !== "undefined") {
//         //     const storedToken = sessionStorage.getItem("token");
//         //     setToken(storedToken);

//         //     if (storedToken) {
//         //         try {
//         //             const decoded = jwtDecode(storedToken) as DecodedToken;
//         //             setDecodedToken(decoded);
//         //         } catch (error) {
//         //             console.error("Error decoding token:", error);
//         //         }
//         //     }

//         //     setLoading(false);
//         // }
//         const handleStorageChange = () => {
//             if (typeof window !== "undefined") {
//                 const storedToken = sessionStorage.getItem("token");
//                 setToken(storedToken);

//                 if (storedToken) {
//                     try {
//                         const decoded = jwtDecode(storedToken) as DecodedToken;
//                         setDecodedToken(decoded);
//                     } catch (error) {
//                         console.error("Error decoding token:", error);
//                     }
//                 }

//                 setLoading(false);
//             }
//         };

//         window.addEventListener("sessionUpdate", handleStorageChange);
//         return () => window.removeEventListener("sessionUpdate", handleStorageChange);
//     }, []);

//     return {
//         token,
//         user: decodedToken,
//         isAuthenticated: !!token && !!decodedToken,
//         loading
//     };
// }

// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    nameid: string;
    email: string;
    unique_name: string;
    role: string;
}

export function useAuth() {
    // Initialize state by directly reading from sessionStorage
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("token");
        }
        return null;
    });

    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(() => {
        if (typeof window !== "undefined") {
            const storedToken = sessionStorage.getItem("token");
            if (storedToken) {
                try {
                    return jwtDecode(storedToken) as DecodedToken;
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(false);

    // This effect will run on mount and refresh the token data
    useEffect(() => {
        const refreshToken = () => {
            if (typeof window !== "undefined") {
                const storedToken = sessionStorage.getItem("token");
                setToken(storedToken);

                if (storedToken) {
                    try {
                        const decoded = jwtDecode(storedToken) as DecodedToken;
                        setDecodedToken(decoded);
                    } catch (error) {
                        console.error("Error decoding token:", error);
                        setDecodedToken(null);
                    }
                } else {
                    setDecodedToken(null);
                }

                setLoading(false);
            }
        };

        refreshToken();

        // Listen for storage events (in case token is updated in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "token") {
                refreshToken();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return {
        token,
        user: decodedToken,
        isAuthenticated: !!token && !!decodedToken,
        loading
    };
}