import { useAuthStore } from "@/store/use-auth-store"

export const useAuth = () => {
  const auth = useAuthStore();

  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated,
    userInfo: auth.user
  }
}