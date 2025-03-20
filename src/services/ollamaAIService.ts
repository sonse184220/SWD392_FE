import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function ollamaSearch(requestMessage: string): Promise<AxiosResponse> {
    try {
        const response = await axiosInstance.post(
            "/api/Search/query",
            { searchPrompt: requestMessage }
        );
        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}