import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

export async function getDestinationList(): Promise<AxiosResponse> {
    return await axiosInstance.get("/api/Destination");
}

export async function addDestination(destination: { destinationName: string, address: string, description: string, status: string, ward: string, imageFile?: File | null }): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append("destinationName", destination.destinationName);
    formData.append("address", destination.address);
    formData.append("description", destination.description);
    formData.append("status", destination.status);
    formData.append("ward", destination.ward);
    if (destination.imageFile) {
        formData.append("imageFile", destination.imageFile);
    }
    return await axiosInstance.post("/api/Destination", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export async function updateDestination(destinationId: string, destination: { destinationName: string, address: string, description: string, status: string, ward: string, imageFile?: File | null }): Promise<AxiosResponse> {
    return await axiosInstance.put(`/api/Destination/${destinationId}`, destination);
}

export async function deleteDestination(destinationId: string): Promise<AxiosResponse> {
    return await axiosInstance.delete(`/api/Destination/${destinationId}`);
}

export async function getDestinationById(destinationId: string): Promise<AxiosResponse> {
    return await axiosInstance.get(`/api/Destination/${destinationId}`);
}