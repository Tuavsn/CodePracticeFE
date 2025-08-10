'use client'
import { useEffect } from "react";
import { useAuthContext } from "./auth-context";
import { apiClient } from "@/lib/api/api-client";
import { ThemeProvider } from "./theme-context";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: React.ReactNode }) {
	const initializeAuth = useAuthContext(state => state.initializeAuth);

	useEffect(() => {
		initializeAuth();
		apiClient.setAuthStore(() => {
			const state = useAuthContext.getState();
			return {
				accessToken: state.accessToken,
				refreshAccessToken: state.refreshAccessToken
			};
		});
	}, [initializeAuth]);

	return <>
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
		<Toaster />
	</>
}