import { useAuthContext } from "@/contexts/auth-context"
import { useEffect } from "react";

export const useAuth = () => {
  const store = useAuthContext();

  useEffect(() => {
    store.getInitialState();
  }, [])

  return store;
}