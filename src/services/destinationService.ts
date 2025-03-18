import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getDestinationList(): Promise<AxiosResponse> {
    return await axiosInstance.get("/api/Destination");
}

export async function addDestination(destination: { destinationName: string, address: string, description: string, status: string, ward: string }): Promise<AxiosResponse> {
    return await axiosInstance.post("/api/Destination", destination);
}

export async function updateDestination(destinationId: string, destination: { destinationName: string, address: string, description: string, status: string, ward: string }): Promise<AxiosResponse> {
    return await axiosInstance.put(`/api/Destination/${destinationId}`, destination);
}

export async function deleteDestination(destinationId: string): Promise<AxiosResponse> {
    return await axiosInstance.delete(`/api/Destination/${destinationId}`);
}

export async function getDestinationById(destinationId: string): Promise<AxiosResponse> {
    return await axiosInstance.get(`/api/Destination/${destinationId}`);
}