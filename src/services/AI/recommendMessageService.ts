import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../axiosInstance";

export async function getRecommendation(): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.post(
            "/cityscout/ai/get-recommendation",
            { message: "string" } 
        );
        return response;
    } catch (error) {
        console.error("Error getting recommendation:", error);
        throw error;
    }
}
