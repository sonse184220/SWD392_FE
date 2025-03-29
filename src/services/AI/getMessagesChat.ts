import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../axiosInstance";

export async function getMessageChat(token: string): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.get(
            "/cityscout/ai/get-messages-chat",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response;
    } catch (error) {
        console.error("Error getting recommendation:", error);
        throw error;
    }
}
