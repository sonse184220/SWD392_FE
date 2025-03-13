import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getCategoryList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/Category", {}
    )

    return response;
}

export async function addCategory(category: { name: string, description: string }): Promise<AxiosResponse> {
    const response = await axiosInstance.post(
        "/api/Category", category
    )

    return response;
}

export async function updateCategory(categoryId: string, category: { name: string, description: string }): Promise<AxiosResponse> {
    const response = await axiosInstance.put(
        `/api/Category/${categoryId}`, category
    )

    return response;
}

export async function deleteCategory(categoryId: string): Promise<AxiosResponse> {
    const response = await axiosInstance.delete(
        `/api/Category/${categoryId}`, {}
    )

    return response;
}