"use client"
import UserLayout from "./user/layout";
// import { UserPage } from "./user/page";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (pathname !== "/user") {
    router.replace("/user"); // Use replace instead of push to prevent history stacking
    // }
  }, [router]);

  return null;

  // return (
  //   <main>
  //     {/* <UserLayout> */}
  //     <UserPage />
  //     {/* </UserLayout> */}
  //   </main>
  // );
}
