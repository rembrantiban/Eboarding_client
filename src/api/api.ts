import axios from "axios"


const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"

 const axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true
 })

 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
   
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

 export default axiosInstance