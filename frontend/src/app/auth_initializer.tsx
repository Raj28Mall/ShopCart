"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'; 

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const fetchAuthStatus = useAuthStore((state) => state.fetchAuthStatus);

  useEffect(() => {
    console.log("AuthInitializer: Component mounted, calling fetchAuthStatus...");
    fetchAuthStatus();
  }, [fetchAuthStatus]); 


  return <>{children}</>; 
}