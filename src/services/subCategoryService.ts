import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getSubCategoryList(): Promise<AxiosResponse> {
    return await axiosInstance.get("/api/SubCategory");
}

export async function addSubCategory(subCategory: { name: string; description: string; categoryId: string }): Promise<AxiosResponse> {
    return await axiosInstance.post("/api/SubCategory", subCategory);
}

export async function updateSubCategory(subCategoryId: string, subCategory: { name: string; description: string; categoryId: string }): Promise<AxiosResponse> {
    return await axiosInstance.put(`/api/SubCategory/${subCategoryId}`, subCategory);
}

export async function deleteSubCategory(subCategoryId: string): Promise<AxiosResponse> {
    return await axiosInstance.delete(`/api/SubCategory/${subCategoryId}`);
}
