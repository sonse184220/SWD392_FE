import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getSubCategoryList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/SubCategory", {}
    )

    return response;
}