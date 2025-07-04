import { AuthService, LoginRequest, RegisterRequest } from "@/lib/services/auth.service";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const useAuthContext = create<AuthStore>() (
  persist(
    (set, get) => ({
      ...initialState,
      login: async(request: LoginRequest) => {
        set({isLoading: true, error: null});
        try {
          const response = await AuthService.login(request);
          set({
            user: {
              id: 
            },
            accessToken:
            refreshToken:
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },
      register: async(request: RegisterRequest) => {

      },
      logout: async() => {

      },
      refreshToken: async() => {

      },
      getCurrentUser: async() => {

      },
      clearError: () => {

      },
      setLoading: () => {

      },
      initializeAuth: () => {

      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)