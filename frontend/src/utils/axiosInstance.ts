"use client";
import axios from 'axios';
import { useAuthStore } from "../store/authStore"; 
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Adding Authorization header for protected API requersts
instance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState(); 
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("This is in axios instance. Error 401: Unauthorized. Logging out.");
    }
    return Promise.reject(error);
  }
);

export default instance;
