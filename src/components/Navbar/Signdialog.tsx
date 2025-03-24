import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { auth, provider, signInWithPopup, signOut } from "../../../firebaseAuth";
import { User } from "firebase/auth";
import { FaGoogle } from 'react-icons/fa';
import { login } from '@/services/authService';
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DecodedToken {
    nameid: string;
    email: string;
    unique_name: string;
    role: string;
}

const Signin = () => {
    let [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);

            const firebaseToken = await result.user.getIdToken();

            const response = await login(firebaseToken);

            if (response.status === 200) {

                sessionStorage.setItem("token", response.data.accessToken)
                window.dispatchEvent(new Event("sessionUpdate"));
                setIsOpen(false)
                toast.success("Login successful!");
                // const user = jwtDecode(response.data.accessToken) as DecodedToken
                // console.log("decode", user)
                // if (user.role === "Admin") router.push("/admin");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Login Failed", error);
        } finally {
            setLoading(false);
        }
    };

    // if (loading) return (
    //     <div className="fixed inset-0 overflow-y-auto">

    //     </div>
    // );

    return (
        <>
            <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0">
                <div className='hidden lg:block'>
                    <button type="button"
                        // className='text-lg text-blue font-medium' 
                        className="text-blue text-lg font-medium ml-9 py-5 px-16 transition duration-150 ease-in-out leafbutton bg-lightblue hover:text-white hover:bg-blue"
                        onClick={openModal}>
                        Sign In
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                                        <div className="w-full max-w-md space-y-8">
                                            <div>
                                                <img
                                                    className="mx-auto h-12 w-auto"
                                                    src="/image.png"
                                                    alt="Company"
                                                />
                                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                                    Sign in to your account
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    {loading ?
                                        (
                                            <div className='flex justify-center items-center'>
                                                <span className="w-20 h-20 loading loading-ring"></span>
                                            </div>

                                        ) : (<>
                                            <div>
                                                <button
                                                    // type="submit"
                                                    onClick={handleSignIn}
                                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                        {/* <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" /> */}
                                                        <FaGoogle className="h-5 w-5 text-white-500" />
                                                    </span>
                                                    Sign in with Google Account
                                                </button>
                                            </div>


                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    onClick={closeModal}
                                                >
                                                    Got it, thanks!
                                                </button>
                                            </div>
                                        </>
                                        )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>

                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Signin;
