/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authStatus } from '@/lib/api';

export interface User {
  id: string
  name: string
  email: string
  picture: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "pending";
  dateJoined: string; 
}

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  fetchAuthStatus: () => Promise<void>;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

interface AuthStatusResponse {
  isAuthenticated: boolean;
  user?: User; 
  accessToken?: string | null;
  error?: string; 
}


async function verifySessionWithBackend( currentAccessToken: string | null): Promise<AuthStatusResponse> {
  if (!currentAccessToken) {
    console.log("verifySessionWithBackend: No access token in store to verify.");
    return { isAuthenticated: false, user: undefined, error: "No access token." };
  }
    try {
      const backendResponse = await authStatus();
  
      if (backendResponse && backendResponse.isAuthenticated && backendResponse.user) {
        return {
          isAuthenticated: true,
          user: backendResponse.user as User,
          accessToken: currentAccessToken,
        };
      } else {
        return {
          isAuthenticated: false,
          user: undefined,
          error: backendResponse?.message || "Session not valid (as per backend).",
          accessToken: null,
        };
      }
    } catch (error: any) {
      console.error("verifySessionWithBackend: Verification failed:", error);
      return {
        isAuthenticated: false,
        user: undefined,
        error: error.message || "Session verification failed.",
        accessToken: null,
      };
    }
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: true,
      error: null,

      fetchAuthStatus: async () => {
        set({ isLoading: true, error: null });
        const currentToken = get().accessToken;

        const result = await verifySessionWithBackend(currentToken);

        if (result.isAuthenticated && result.user) {
          set({
            isAuthenticated: true,
            user: result.user,
            isAdmin: (result.user.role === 'admin') || (result.user.role === "superadmin"),
            accessToken: result.accessToken || currentToken,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
            accessToken: null, // Clear token if invalid
            isLoading: false,
            error: result.error || 'Failed to authenticate session',
          });
        }
      },


      login: (token: string, userData: User) => {
        set({
          accessToken: token,
          user: userData,
          isAuthenticated: true,
          isAdmin: (userData.role === 'admin') || (userData.role === 'superadmin'), 
          isLoading: false, 
          error: null,
        });
      },

      logout: () => set({
        accessToken: null, 
        user: null,
        isAuthenticated: false, 
        isAdmin: false,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);
