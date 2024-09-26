import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import { refreshToken } from "./UserRefresh"; // Import your refresh token function
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a request interceptor
apiAuth.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem(ACCESS_TOKEN);
        
        if (token) {
            // Decode the token and check expiration
            const decodedToken = jwtDecode(token);
            const now = moment().unix();
            
            // If the token is expired, attempt to refresh it
            if (decodedToken.exp < now) {
                const newToken = await refreshToken();
                
                if (newToken) {
                    token = newToken; // Update the token variable with the new token
                    localStorage.setItem(ACCESS_TOKEN, newToken); // Update the access token in local storage
                } 
            }
            
            // Set the Authorization header with the valid token
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Return the modified config
    },
    (error) => {
        return Promise.reject(error); // Handle request error
    }
);

// Create a separate Axios instance for general API requests
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
