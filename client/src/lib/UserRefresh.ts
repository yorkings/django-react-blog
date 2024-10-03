import { toast } from "react-toastify";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { api } from "./Api";

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
        toast.error("Refresh token not found. Please log in.");
        return null; // Exit if no refresh token is found
    }

    try {
        const res = await api.post('user/token/refresh/', { refresh: refreshToken });

        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access); // Update the access token in local storage
            toast.success("Access token refreshed successfully.");
            return res.data.access; // Return the new access token
        } else {
            toast.error("Failed to refresh access token.");
            return null;
        }
    } catch (error){
        console.log(error.message)
        localStorage.clear()
        return null; // Return null on error
    }
}    