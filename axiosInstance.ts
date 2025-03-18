import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5028/',
    // baseURL: 'https://cityscout.azurewebsites.net/',
});