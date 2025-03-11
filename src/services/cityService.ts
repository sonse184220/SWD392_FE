import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getCityList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/City", {}
    )

    return response;
}