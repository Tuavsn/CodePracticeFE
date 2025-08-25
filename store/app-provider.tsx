'use client'
import { useEffect } from "react";
import { useAuthStore } from "./use-auth-store";
import { apiClient } from "@/lib/api/api-client";
import { ThemeProvider } from "./theme-context";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: React.ReactNode }) {
	const initializeAuth = useAuthStore(state => state.initializeAuth);

	useEffect(() => {
		initializeAuth();
		apiClient.setAuthStore(() => {
			const state = useAuthStore.getState();
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