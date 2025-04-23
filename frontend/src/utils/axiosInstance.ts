"use client";
import axios from 'axios';
import { useAuthStore } from "../store/authStore"; // Path to your auth store

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,  // Replace with your backend API URL
});

// Add Authorization header on every request
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
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default instance;
