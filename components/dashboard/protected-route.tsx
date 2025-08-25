'use client'
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: string;
	fallbackPath?: string;
}

export default function ProtectedRoute({
	children,
	requiredRole = 'SYSTEM_ADMIN',
	fallbackPath = '/login'
}: ProtectedRouteProps) {
	const router = useRouter();
	const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			if (!isAuthenticated) {
				await initializeAuth();
			}
			setIsChecking(false);
		};

		checkAuth();
	}, [isAuthenticated, initializeAuth]);

	useEffect(() => {
		if (!isChecking && !isLoading) {
			if (!isAuthenticated) {
				router.push(`${fallbackPath}?redirect=${encodeURIComponent(window.location.pathname)}`);
				return;
			}

			if (requiredRole && !hasRequiredRole(user, requiredRole)) {
				router.push('/unauthorized');
				return;
			}
		}
	}, [isChecking, isLoading, isAuthenticated, user, requiredRole, router, fallbackPath]);

	const hasRequiredRole = (user: any, role: string): boolean => {
		if (!user) return false;

		if (user.role && Array.isArray(user.role)) {
			return user.role.some((r: string) => r.toLowerCase() === role.toLowerCase());
		}

		return false;
	};

	// Loading state
	if (isChecking || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!isAuthenticated || (requiredRole && !hasRequiredRole(user, requiredRole))) {
		return null;
	}

	return <>{children}</>;
}