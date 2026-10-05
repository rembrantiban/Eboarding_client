import axios from "axios"
import { useSessionStore } from "@/store/useSessionStore"


const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"

// Endpoints where a 401 means bad credentials, not an expired session
const PUBLIC_AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"]

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

 axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const sentToken = !!error.config?.headers?.Authorization;
    const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) => url.endsWith(path));

    if (error.response?.status === 401 && sentToken && !isPublicAuth) {
      useSessionStore.getState().showExpired();
    }

    return Promise.reject(error);
  }
);

 export default axiosInstance
