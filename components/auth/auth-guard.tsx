import { useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react"

interface AuthGuardProps {
	children: ReactNode,
	fallback?: ReactNode
}

export default function AuthGuard({
	children,
	fallback
}: AuthGuardProps) {
	const { isAuthenticated, isLoading, initializeAuth } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		initializeAuth()
	}, [initializeAuth])

	if (isLoading) {
		return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
	}

	if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

	return (
		<>{children}</>
	)
}