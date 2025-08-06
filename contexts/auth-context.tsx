import { API_CONFIG } from "@/lib/api/api-config";
import { AuthService } from "@/lib/services/auth.service";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from 'zustand/middleware'

interface AuthState {
	user: Partial<User> | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

interface AuthAction {
	login: () => void;
	register: () => void;
	logout: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	getCurrentUser: () => Promise<void>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
	initializeAuth: () => Promise<void>;
	handleAuthCallback: (code: string) => Promise<void>
}

type AuthStore = AuthState & AuthAction;

const OAUTH_CONFIG = {
	authServerUrl: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || '',
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
	redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
	postLogoutRedirectUrl: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || '',
	scope: 'openid profile email'
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
}

export const useAuthContext = create<AuthStore>()(
	persist(
		(set, get) => ({
			...initialState,
			login: async () => {
				set({ isLoading: true, error: null });
				try {
					// Generate PKCE parameters
					const codeVerifier = AuthService.generateCodeVerifier();
					const codeChallenge = await AuthService.generateCodeChallenge(codeVerifier);
					const state = AuthService.generateState();
					// Store PKCE parameters in session storage
					sessionStorage.setItem('oauth_code_verifier', codeVerifier);
					sessionStorage.setItem('oauth_state', state);
					// Construct authorization URL
					window.location.href = AuthService.buildAuthUrl(codeChallenge, state);
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Login initialization failed';
					set({ isLoading: false, error: errorMessage });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},
			register: () => {
				window.location.href = `${OAUTH_CONFIG.authServerUrl}/register`
			},
			logout: async () => {
				set({ isLoading: true, error: null });
				// Retrieve access token
				const { accessToken } = get();
				if (!accessToken) {
					throw new Error('No access token token available');
				}
				// Revoke token
				try {
					if (accessToken) await AuthService.revokeToken(accessToken);
					// Clear state
					set(initialState)
					// Redirect to logout endpoint
					// window.location.href = `${OAUTH_CONFIG.authServerUrl}/logout?post_logout_redirect_uri=${encodeURIComponent(OAUTH_CONFIG.postLogoutRedirectUrl)}`;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Logout failed';
					set({ ...initialState, isLoading: false, error: errorMessage });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},
			handleAuthCallback: async (code: string) => {
				set({ isLoading: true, error: null });
				try {
					// Retrieve PKCE parameters
					const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
					const storedState = sessionStorage.getItem('oauth_state');
					if (!codeVerifier || !storedState) {
						throw new Error('Invalid OAuth State');
					}
					// Exchange authorization code for tokens
					const tokens = await AuthService.exchangeCodeForToken(code, codeVerifier);
					// Get User object
					const user = await AuthService.buildUserFromToken(tokens.access_token);
					// Set state
					set({
						user,
						accessToken: tokens.access_token,
						refreshToken: tokens.refresh_token,
						isAuthenticated: true,
						isLoading: false,
						error: null
					})
					// Clean up session storage
					sessionStorage.removeItem('oauth_code_verifier');
					sessionStorage.removeItem('oauth_state');
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
					set({ ...initialState, error: errorMessage });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},
			refreshAccessToken: async () => {
				set({ isLoading: true, error: null })
				// Retrieve refresh token
				const { refreshToken } = get();
				if (!refreshToken) {
					throw new Error('No refresh token available');
				}
				try {
					// Retrieve access token from refresh token
					const tokens = await AuthService.refreshAccessToken(refreshToken);
					set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token || refreshToken, });
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Session expired. Please login again.';
					set({ ...initialState, error: errorMessage });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},
			getCurrentUser: async () => {
				set({ isLoading: true, error: null })
				// Retrieve access token
				const { accessToken } = get();
				if (!accessToken) {
					throw new Error('No access token token available');
				}
				try {
					// Retrieve Userinfo
					const user = await AuthService.buildUserFromToken(accessToken);
					set({ user });
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
					set({ ...initialState, error: errorMessage });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			clearError: () => {
				set({ error: null })
			},
			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},
			initializeAuth: async () => {
				// Retrieve tokens
				const { accessToken, refreshToken } = get();
				if (!accessToken) {
					return ;
				}
				try {
					// Check if token is still valid
					const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
					const now = Date.now() / 1000;
					if (tokenPayload.exp > now) {
						set({ isAuthenticated: true });
						await get().getCurrentUser();
					} else if (refreshToken) {
						await get().refreshAccessToken();
					} else {
						set(initialState);
					}
				} catch (error) {
					console.error('Auth initialization failed:', error);
					set(initialState);
				}
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

export const useAuthCallBack = () => {
	const handleAuthCallback = useAuthContext(state => state.handleAuthCallback);
	return {
		handleCallback: async (searchParams: URLSearchParams) => {
			const code = searchParams.get('code');
			const state = searchParams.get('state');
			const error = searchParams.get('error');

			if (error) {
				throw new Error(searchParams.get('error_description') || error);
			}

			if (!code || !state) {
				throw new Error('Invalid OAuth callback parameters');
			}

			const storedState = sessionStorage.getItem('oauth_state');

			if (state !== storedState) {
				throw new Error('Invalid OAuth state parameter');
			}

			await handleAuthCallback(code);
		}
	};
}