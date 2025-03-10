import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance"
export async function login(token: string): Promise<AxiosResponse> {
    const response = await axiosInstance.post(
        "/cityscout/auth/firebase",
        { "firebaseToken": token }
    )

    return response;
}