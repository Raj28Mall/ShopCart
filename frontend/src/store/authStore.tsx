import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setToken: (token: string, isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      isAdmin: false,
      setToken: (token, admin) => set({ accessToken: token, isAdmin:admin, isAuthenticated: true }),
      logout: () => set({ accessToken: null, isAuthenticated: false, isAdmin: false }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);
