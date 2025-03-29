import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function sendMessage(requestMessage: string): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.post(
            "/cityscout/ai/send-message",
            { message: requestMessage }
        );
        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

export async function getRecommendation(token: string, requestMessage: string): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.post(
            "/cityscout/ai/get-recommendation",
            { message: requestMessage },
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
