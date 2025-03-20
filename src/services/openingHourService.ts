import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export interface OpeningHourRequest {
    destinationId: string;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}

export async function getOpeningHoursByDestinationId(destinationId: string): Promise<AxiosResponse> {
    return await axiosInstance.get(`/api/OpeningHour/${destinationId}`);
}

export async function addOpeningHour(openingHour: OpeningHourRequest): Promise<AxiosResponse> {
    return await axiosInstance.post("/api/OpeningHour", openingHour);
}

export async function updateOpeningHour(destinationId: string, dayOfWeek: string, openingHour: OpeningHourRequest): Promise<AxiosResponse> {
    return await axiosInstance.put(`/api/OpeningHour`, openingHour);
}

export async function deleteOpeningHour(destinationId: string, dayOfWeek: string): Promise<AxiosResponse> {
    return await axiosInstance.delete(`/api/OpeningHour/${destinationId}/${dayOfWeek}`);
}