import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { toast } from "react-toastify";
import moment from "moment"; // Make sure moment is imported
import { apiAuth } from "./Api";
import { useEffect, useState, useCallback } from "react";

// Custom hook for authentication
export const useAuth = () => {
    const [user, setUser] = useState(null);

    // Define the Authentic function with useCallback
    const Authentic = useCallback(async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) { // Check if token exists
            const decodedToken = jwtDecode(token);
            const now = moment().unix();

            if (decodedToken.exp < now) {
                await refreshAuth(); // Refresh the auth if token is expired
                return Authentic(); // Retry fetching the user after refreshing
            }
            return decodedToken; // Return the decoded token with username and other info
        } 
        return null; // Return null if no token exists
    }, []); // Dependencies can be added if needed

    const refreshAuth = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            toast.error("Refresh token not found. Please log in."); // Handle missing refresh token
            return; // Exit if no refresh token is found
        }

        try {
            const res = await apiAuth.post('user/token/refresh/', { refresh: refreshToken });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access); // Assuming the new access token is in res.data.access
                toast.success("Access token refreshed successfully."); // Notify user of success
            } else {
                toast.error("Failed to refresh access token."); // Notify user of failure
            }
        } catch (error) {
            toast.error("Error refreshing access token: " + (error.response?.data?.detail || error.message)); // Handle error appropriately
        }
    };

    useEffect(() => {
        const startTokenCheck = () => {
            const intervalId = setInterval(() => {
                Authentic().then((decodedToken) => {
                    if (decodedToken) {
                        setUser(decodedToken); // Update user state if valid token
                    }
                });
            }, 60000);

            return () => clearInterval(intervalId); // Cleanup on unmount
        };

        startTokenCheck();
    }, [Authentic]); // Now Authentic is stable and included

    return user; // Return user information (decoded token)
};
