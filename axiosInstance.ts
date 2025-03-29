import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5028/',
    // baseURL: 'https://cityscout.azurewebsites.net/',
    // baseURL: 'http://cityscouttravel.somee.com/',
    // baseURL: 'https://www.cityscouttravel.somee.com/',
});
// import axios from "axios";

// // Determine if we're running on the client side and in production
// const isClient = typeof window !== 'undefined';
// const isProduction = process.env.NODE_ENV === 'production';

// // In production on the client side, use relative URLs that will be proxied
// // In development or on server-side, use the direct URL
// const baseURL = (isClient && isProduction)
//     ? '/api/proxy' // This will be handled by our proxy API route
//     : 'http://cityscouttravel.somee.com/';

// export const axiosInstance = axios.create({
//     baseURL,
// });

// // Add interceptor to modify request paths when using the proxy
// if (isClient && isProduction) {
//     axiosInstance.interceptors.request.use(config => {
//         // Extract the actual API path if it starts with '/api/'
//         // if (config.url?.startsWith('/api/')) {
//         //     // Remove '/api/proxy' from the path and prepend the original path
//         //     config.url = config.url.replace('/api/proxy', '');
//         // }
//         if (config.url) {
//             // Ensure path starts without a leading slash to prevent double slashes
//             config.url = config.url.replace(/^\/+/, "");

//             // Ensure it's properly prefixed with "/api/proxy/"
//             // config.url = `/api/proxy/${config.url}`;
//         }
//         return config;
//     });
// }