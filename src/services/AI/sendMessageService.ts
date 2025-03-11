import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../axiosInstance";

export async function sendMessage(): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.post(
            "/cityscout/ai/send-message",
            { message: "string" }
        );
        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}
