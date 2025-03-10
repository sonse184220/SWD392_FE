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
    profileData: {
        userId?: string;
        username?: string;
        phoneNumber?: string;
        address?: string;
    }
): Promise<any> {
    const response = await axiosInstance.put(
        `/cityscout/profile/${userId}`,
        profileData
    );

    return response;
}