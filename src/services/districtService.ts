import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

interface DistrictData {
    name: string;
    description: string;
    cityId: string;
    districtId?: string;
}

export async function getDistrictList(): Promise<AxiosResponse> {
    return await axiosInstance.get("/api/District");
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
