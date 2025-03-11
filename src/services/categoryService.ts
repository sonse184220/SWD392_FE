import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getCategoryList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/Category", {}
    )

    return response;
}