import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getCityList(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(
        "/api/City", {}
    )

    return response;
}

export async function addCity(city: { name: string, description: string }): Promise<AxiosResponse> {
    const response = await axiosInstance.post(
        "/api/City", city
    )

    return response;
}

export async function updateCity(cityId: string, city: { name: string, description: string }): Promise<AxiosResponse> {
    const response = await axiosInstance.put(
        `/api/City/${cityId}`, city
    )

    return response;
}

export async function deleteCity(cityId: string): Promise<AxiosResponse> {
    const response = await axiosInstance.delete(
        `/api/City/${cityId}`, {}
    )

    return response;
}