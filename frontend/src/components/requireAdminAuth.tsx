"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAdminAuth = ({ children }: RequireAuthProps) => {
  const { isAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if(!isAdmin) {
      router.push("/admin/auth");
    }
  }, [ router, isAdmin]);

  if(!isAdmin) {
    return <div className="text-center p-4">You are not authorized. Redirecting to login.</div>;
  }

  return <>{children}</>;
};
