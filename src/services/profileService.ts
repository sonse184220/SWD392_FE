import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance"
export async function getUserProfile(userId: string): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        `/cityscout/profile/${userId}`, {}
    )

    return response;
}

export async function updateUserProfile(
    userId: string,
    // profileData: {
    //     userId?: string;
    //     username?: string;
    //     phoneNumber?: string;
    //     address?: string;
    //     profileImage?: File | null;
    // }
    profileData: FormData
): Promise<any> {
    // const formData = new FormData();

    // // Append only non-null and non-undefined values
    // Object.entries(profileData).forEach(([key, value]) => {
    //     if (value !== undefined && value !== null) {
    //         // Check if the value is a File (image) and append it properly
    //         if (key === "profileImage" && value instanceof File) {
    //             formData.append("profileImage", value);
    //         } else {
    //             formData.append(key, value.toString());
    //         }
    //     }
    // });

    const response = await axiosInstance.put(`/cityscout/profile/${userId}`, profileData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    // const response = await axiosInstance.put(
    //     `/cityscout/profile/${userId}`,
    //     profileData
    // );

    return response;
}