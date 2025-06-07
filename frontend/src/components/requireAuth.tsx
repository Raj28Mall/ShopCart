import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore'; 
import { toast } from 'react-hot-toast';

interface RequireAuthProps {
  children: React.ReactNode;
}

const useHydratedAuth = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/');
      toast.error('You must be logged in to access this page.');
    }
  }, [isHydrated, isAuthenticated, router]);

  return !isHydrated;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated } = useAuthStore();
  const isLoading = useHydratedAuth();

  if (isLoading) {
    return <div className="text-center p-4">Loading</div>;
  }
  if (!isAuthenticated) {
    return <div className="text-center p-4">Redirecting to login...</div>;
  }

  return <>{children}</>;
};