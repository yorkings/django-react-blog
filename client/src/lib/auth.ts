import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { toast } from "react-toastify";
import moment from "moment";
import { api} from "./Api";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";


export  const Authentic = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = moment().unix();
      if (decodedToken.exp < now) {
        await refreshAuth();
        return Authentic(); // Retry after refreshing
      }
      return decodedToken;
    }
  
}

const refreshAuth = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      toast.error("Refresh token not found. Please log in.");
      return;
    }

    try {
      const res = await api.post("user/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        toast.success("Access token refreshed successfully.");
      } else {
        toast.error("Failed to refresh access token.");
        
        
      }
    } catch (error) {
      toast.error("Error refreshing access token: " + (error.response?.data?.detail || error.message));
      localStorage.clear()
    }
  };

export const  TokenChecker=()=>{
  useEffect(()=>{
    const startTokenCheck=()=>{
      setInterval(Authentic(),300000)     
   } 
   return ()=>{
    startTokenCheck()
   }
  },[])
} 

  

