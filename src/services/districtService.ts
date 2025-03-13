import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

interface DistrictData {
    name: string;
    address: string;
    description: string;
    rate: number;
    categoryId: string;
    ward: string;
    status: string;
    districtId?: string;
}

export async function getDistrictList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/District", {}
    )

    return response;
}

export async function addDistrict(district: DistrictData): Promise<AxiosResponse> {
    return await axiosInstance.post("/api/District", district);
}

export async function updateDistrict(districtId: string, district: DistrictData): Promise<AxiosResponse> {
    return await axiosInstance.put(`/api/District/${districtId}`, district);
}

export async function deleteDistrict(districtId: string): Promise<AxiosResponse> {
    return await axiosInstance.delete(`/api/District/${districtId}`);
}