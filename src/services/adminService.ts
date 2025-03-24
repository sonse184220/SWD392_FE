import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axiosInstance";

interface Account {
    userId: string;
    userName: string;
    phoneNumber: string;
    address: string;
    email: string;
    isActive: boolean;
    roleId: number;
    profilePicture: string;
}

/**
 * Fetches the list of all accounts
 * @returns Promise with the response containing account list
 */
export async function getAccountList(): Promise<AxiosResponse<Account[]>> {
    return await axiosInstance.get("/api/Admin/accounts");
}

/**
 * Activates a user account
 * @param userId The ID of the user to activate
 * @returns Promise with the response
 */
export async function activateAccount(userId: string): Promise<AxiosResponse<string>> {
    return await axiosInstance.put(`/api/Admin/activate/${userId}`);
}

/**
 * Deactivates a user account
 * @param userId The ID of the user to deactivate
 * @returns Promise with the response
 */
export async function deactivateAccount(userId: string): Promise<AxiosResponse<string>> {
    return await axiosInstance.put(`/api/Admin/deactivate/${userId}`);
}

/**
 * Gets a specific account by user ID
 * @param userId The ID of the user to retrieve
 * @returns Promise with the response containing the account
 */
export async function getAccountById(userId: string): Promise<AxiosResponse<Account>> {
    return await axiosInstance.get(`/api/Admin/${userId}`);
}