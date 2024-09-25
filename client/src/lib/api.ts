import axios from "axios";

const api= axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout:5000,
    // Define headers that will be included in every request made using this instance. This is common for specifying the content type and accepted response type.
    headers: {
        'Content-Type': 'application/json', // The request will be sending data in JSON format.
        Accept: 'application/json', // The request expects a response in JSON format.
    },

  });
api.interceptors.request.use((config)=>{
  const token=localStorage.getItem(ACCESS_TOKEN)
  if(token){
    config.headers.Authorization= "Bearer ${token}";
  }
})