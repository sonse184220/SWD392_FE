import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getDistrictList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/District", {}
    )

    return response;
}