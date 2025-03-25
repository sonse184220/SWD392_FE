import React from "react";
import Link from "next/link";
import { auth, provider, signInWithPopup, signOut } from "../../../firebaseAuth";
import { login } from "@/services/authService";


interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', current: true },
  { name: 'Places', href: '/user/destinations', current: false },
  { name: 'ChatAI', href: '/user/cityAI', current: false },
  { name: 'Cultural', href: '/user/places-information', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Data = () => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      const response = await login(firebaseToken);

      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.accessToken)
        window.dispatchEvent(new Event("sessionUpdate"));
      }
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current ? 'text-black hover:opacity-100' : 'hover:text-black hover:opacity-100',
                  'px-2 py-1 text-lg font-normal opacity-75 block'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4"></div>
            <button onClick={handleSignIn} className="bg-white w-full text-blue border border-lightblue font-medium py-2 px-4 rounded">
              Sign In
            </button>
            {/* <button className="bg-lightblue w-full hover:bg-blue hover:text-white text-blue font-medium my-2 py-2 px-4 rounded">
              Sign up
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
