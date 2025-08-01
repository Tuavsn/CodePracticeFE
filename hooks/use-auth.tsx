import { useAuthContext } from "@/contexts/auth-context"

export const useAuth = () => {
  const auth = useAuthContext();

  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated,
    userInfo: auth.user
  }
}