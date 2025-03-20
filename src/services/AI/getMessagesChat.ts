import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../axiosInstance";

export async function getMessageChat(): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.get(
            "/cityscout/ai/get-messages-chat",
        );
        return response;
    } catch (error) {
        console.error("Error getting recommendation:", error);
        throw error;
    }
}
