"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if(isLoading){
    return <div className="text-center p-4">Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center p-4">Redirecting to login...</div>;
  }

  return <>{children}</>;
};
