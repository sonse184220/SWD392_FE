import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

interface Props {
    isLogin: boolean;
}

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true },
    { name: 'Places', href: '/user/destinations', current: false },
    { name: 'AI Chat', href: '/user/cityAI', current: false },
    { name: 'Cultural', href: '/user/places-information', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Navbar: React.FC<Props> = ({ isLogin }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSignOut = async () => {
        try {
            sessionStorage.removeItem("token");
            window.dispatchEvent(new Event("sessionUpdate"));
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };

    return (
        <Disclosure as="nav" className="navbar flex items-center">
            <>
                  {/* LOGO */}
                  <div className="flex flex-shrink-0 ml-10 items-center">
                               
                                <img
                                    className="hidden h-25 w-35 lg:block" // Tăng kích thước logo
                                    src="/cityscoutlogo.jpg"
                                    alt="dsign-logo"
                                />
                            </div>
                {/* Tăng max-width và padding */}
                <div className="mx-auto max-w-screen-xl px-8 py-6 lg:px-12 lg:py-6">
                    <div className="relative flex h-20 items-center justify-between">
                        <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                      

                            {/* LINKS */}
                            <div className="hidden lg:block m-auto">
                                <div className="flex space-x-25"> {/* Tăng khoảng cách giữa các link */}
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current ? 'text-black hover:opacity-100' : 'hover:text-black hover:opacity-100',
                                                'px-4 py-4 text-lg font-normal opacity-75 space-links' // Tăng padding ngang
                                            )}
                                            aria-current={item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

          

                        {/* DRAWER ICON */}
                        <div className="block lg:hidden">
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true" onClick={() => setIsOpen(true)} /> {/* Tăng kích thước icon */}
                        </div>

                        {/* DRAWER LINKS DATA */}
                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata />
                        </Drawer>
                    </div>
                </div>
                              {/* SIGNIN DIALOG */}
                              {isLogin ? (
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button>
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 mr-20"> {/* Tăng kích thước avatar */}
                                            <img className="w-full h-full object-cover" src="/image.png" alt="" />
                                        </div>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/user/profile"
                                                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                                    >
                                                        Account settings
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <form action="#" method="POST">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            type="submit"
                                                            onClick={handleSignOut}
                                                            className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                                        >
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </form>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            <Signdialog />
                        )}
            </>
        </Disclosure>
    );
};

export default Navbar;