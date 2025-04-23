"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className="text-center p-4">Redirecting to login...</div>;
  }

  return <>{children}</>;
};
