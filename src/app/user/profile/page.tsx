"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile } from "@/services/profileService";
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Unauthorized from "@/app/reusePages/unauthorized";

interface UserProfile {
    userId: string;
    userName: string;
    phoneNumber: string;
    address: string;
    email: string;
    isActive: boolean;
    roleId: number;
    profilePicture?: string;
}

export default function Profile() {
    const router = useRouter();
    const { isAuthenticated, user, token } = useAuth();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isOpenUserInfo, setIsOpenUserInfo] = React.useState<boolean>(false);
    const [userInfo, setUserInfo] = React.useState<UserProfile>({
        userId: '',
        userName: '',
        phoneNumber: '',
        address: '',
        email: '',
        isActive: true,
        roleId: 0,
        profilePicture: ''
    });
    const [avataFile, setAvataFile] = React.useState<File | null>(null);

    useEffect(() => {
        getUserProfileInfo();
    }, []);

    const getUserProfileInfo = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.error("Token is null or undefined");
            return;
        }

        const decodedToken = jwtDecode(token) as {
            nameid: string;
            email: string;
            unique_name: string;
            role: string;
        };

        try {
            const response = await getUserProfile(decodedToken.nameid);
            if (response) {
                // Update your state with the profile data
                setUserInfo(response.data);
                console.log(response)
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvataFile(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // const profileUpdateData = {
            //     userId: userInfo.userId,
            //     username: userInfo.userName ? userInfo.userName : "",
            //     phoneNumber: userInfo.phoneNumber ? userInfo.phoneNumber : "",
            //     address: userInfo.address ? userInfo.address : ""
            // };
            const formData = new FormData();
            formData.append("userId", userInfo.userId);
            formData.append("username", userInfo.userName || "");
            formData.append("phoneNumber", userInfo.phoneNumber || "");
            formData.append("address", userInfo.address || "");

            if (avataFile) {
                formData.append("profilePicture", avataFile);
            }

            const response = await updateUserProfile(userInfo.userId, formData);
            if ((await response).status === 200) {
                console.log("success update profile")
                getUserProfileInfo();
            }
            else
                console.log((await response).status.toString);
            setIsOpenUserInfo(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated && user?.role !== "User") {
        // router.push("/");
        return <Unauthorized />;
    }


    return (
        <div className='flex justify-center px-8 py-4 h-screen'>
            <form className='w-3/4'>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="flex justify-center">
                            <div className="flex flex-col items-center m-1 w-1/4 text-center">
                                <h1 className="text-2xl font-extrabold text-gray-900">Personal Information</h1>
                                <p className="mt-1 text-sm/6 text-gray-600">Update your information here.</p>
                            </div>
                        </div>


                        <div className="flex justify-between">
                            
                            <div className="items-center">
                                <p className="flex justify-center ml-35 underline">Profile Picture</p>
                                <img
                                    src={userInfo.profilePicture}
                                    alt="Profile"
                                    className="w-27 h-27 rounded-full border-2 border-gray-300 shadow-md object-cover ml-35"
                                />
                            </div>
                            <Dialog open={isOpenUserInfo} onOpenChange={setIsOpenUserInfo} >
                                <DialogTrigger asChild className="mt-25">
                                    <Button>Edit Profile</Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {Object.keys(userInfo)
                                        .filter(field => field !== 'email' && field !== 'userId' && field !== 'isActive' && field !== 'roleId')
                                        .map((field) => (
                                            <div key={field} className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={field} className="text-left">
                                                    {field === 'userName' ? 'User Name' :
                                                        field === 'phoneNumber' ? 'Phone Number' :
                                                            field === 'address' ? 'Address' :
                                                                field === 'profilePicture' ? 'Profile Picture' :
                                                                    field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Label>
                                                {/* <Input
                                                    id={field}
                                                    name={field}
                                                    type={field === 'profilePicture' ? 'file' : 'text'} // Ensuring profilePicture is text
                                                    value={userInfo[field as keyof UserProfile] as string}
                                                    onChange={handleInputChange}
                                                    className="col-span-3"
                                                /> */}
                                                {field === 'profilePicture' ? (
                                                    <div className="col-span-3">
                                                        <input
                                                            id={field}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor={field}
                                                            className="cursor-pointer bg-black-2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                                        >
                                                            Choose File
                                                        </label>
                                                        {userInfo.profilePicture && (
                                                            <p className="mt-2 text-gray-600">{avataFile?.name}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Input
                                                        id={field}
                                                        name={field}
                                                        type="text"
                                                        value={userInfo[field as keyof UserProfile] as string}
                                                        onChange={handleInputChange}
                                                        className="col-span-3"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleSubmit}>{!isLoading ? 'Save changes' : <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>}</Button>

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={userInfo.email}
                                        readOnly
                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 bg-gray-100 cursor-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="userName" className="block text-sm/6 font-medium text-gray-900">
                                    User name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="userName"
                                        name="userName"
                                        type="text"
                                        autoComplete="name"
                                        value={userInfo.userName}
                                        readOnly
                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 bg-gray-100 cursor-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>



                            <div className="sm:col-span-3">
                                <label htmlFor="phoneNumber" className="block text-sm/6 font-medium text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        autoComplete="tel"
                                        value={userInfo.phoneNumber}
                                        readOnly
                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 bg-gray-100 cursor-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                    Address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        autoComplete="street-address"
                                        value={userInfo.address}
                                        readOnly
                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 bg-gray-100 cursor-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}