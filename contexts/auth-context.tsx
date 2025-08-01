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

const generateCodeVerifier = (): string => {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode(...new Uint8Array(hash)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};

const generateState = (): string => {
	return Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
};

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
			login: () => {
				const initialOauthFlow = async () => {
					set({ isLoading: true, error: null });
					try {
						// Generate PKCE parameters
						const codeVerifier = generateCodeVerifier();
						const codeChallenge = await generateCodeChallenge(codeVerifier);
						const state = generateState();
						// Store PKCE parameters in session storage
						sessionStorage.setItem('oauth_code_verifier', codeVerifier);
						sessionStorage.setItem('oauth_state', state);
						// Construct authorization URL
						const authParams = new URLSearchParams({
							response_type: 'code',
							client_id: OAUTH_CONFIG.clientId,
							redirect_uri: OAUTH_CONFIG.redirectUri,
							scope: OAUTH_CONFIG.scope,
							state: state,
							code_challenge: codeChallenge,
							code_challenge_method: 'S256'
						});
						const authUrl = `${OAUTH_CONFIG.authServerUrl}/oauth2/authorize?${authParams}`;
						window.location.href = authUrl;
					} catch (error) {
						const errorMessage = error instanceof Error ? error.message : 'Login initialization failed';
						set({
							isLoading: false,
							error: errorMessage
						});
					}
				}
				initialOauthFlow();
			},
			register: () => {
				window.location.href = `${OAUTH_CONFIG.authServerUrl}/register`
			},
			logout: async () => {
				set({ isLoading: true, error: null });
				// Revoke token
				try {
					const { accessToken } = get();
					if (accessToken) {
						await fetch(`${OAUTH_CONFIG}/oauth2/revoke`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': `Basic ${btoa(OAUTH_CONFIG.clientId + ':secret')}`
							},
							body: new URLSearchParams({
								token: accessToken,
								token_type_hint: 'access_token'
							})
						})
					}
					// Clear state
					set({
						...initialState,
						isLoading: false
					})
					// Redirect to logout endpoint
					// window.location.href = `${OAUTH_CONFIG.authServerUrl}/logout?post_logout_redirect_uri=${encodeURIComponent(OAUTH_CONFIG.postLogoutRedirectUrl)}`;
				} catch (error) {
					// Even if server logout fails, clear local state
					set({
						...initialState,
						isLoading: false,
						error: error instanceof Error ? error.message : 'Logout failed'
					});
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
					const tokenResponse = await fetch(`${OAUTH_CONFIG.authServerUrl}/oauth2/token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': `Basic ${btoa(OAUTH_CONFIG.clientId + ':secret')}`
						},
						body: new URLSearchParams({
							grant_type: 'authorization_code',
							code: code,
							redirect_uri: OAUTH_CONFIG.redirectUri,
							code_verifier: codeVerifier
						})
					});

					if (!tokenResponse.ok) {
						throw new Error('Token exchange failed')
					}

					const tokens = await tokenResponse.json();

					// Decode JWT to get userInfo
					const tokenPayload = JSON.parse(atob(tokens.access_token.split('.')[1]));
					// Get detail user info
					const userInfoResponse = await fetch(`${OAUTH_CONFIG.authServerUrl}/userinfo`, {
						headers: {
							'Authorization': `Bearer ${tokens.access_token}`
						}
					});
					let userData = null;
					if (userInfoResponse.ok) {
						userData = await userInfoResponse.json();
					}

					// Create user object
					const user: Partial<User> = {
						id: tokenPayload.sub,
						username: userData?.sub || tokenPayload.username || '',
						email: userData?.email || '',
						role: tokenPayload.roles || []
					};

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
					set({
						isLoading: false,
						error: errorMessage,
						isAuthenticated: false,
						user: null,
						accessToken: null,
						refreshToken: null
					});
					throw error;
				}
			},
			refreshAccessToken: async () => {
				const { refreshToken } = get();

				if (!refreshToken) {
					throw new Error('No refresh token available');
				}

				try {
					const response = await fetch(`${OAUTH_CONFIG.authServerUrl}/oauth2/token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': `Basic ${btoa(OAUTH_CONFIG.clientId + ':secret')}`
						},
						body: new URLSearchParams({
							grant_type: 'refresh_token',
							refresh_token: refreshToken
						})
					});

					if (!response.ok) {
						throw new Error('Token refresh failed');
					}

					const tokens = await response.json();

					// Decode new token for user info
					const tokenPayload = JSON.parse(atob(tokens.access_token.split('.')[1]));

					set({
						accessToken: tokens.access_token,
						refreshToken: tokens.refresh_token || refreshToken, // Keep old refresh token if new one not provided
						user: {
							...get().user,
							id: tokenPayload.sub,
							username: tokenPayload.username,
							roles: tokenPayload.roles || []
						} as Partial<User>
					});
				} catch (error) {
					// If refresh fails, logout user
					set({
						...initialState,
						error: 'Session expired. Please login again.'
					});
					throw error;
				}
			},
			getCurrentUser: async () => {
				const { accessToken } = get();
				if (!accessToken) {
					return;
				}
				try {
					const response = await fetch(`${OAUTH_CONFIG.authServerUrl}/userinfo`, {
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});

					if (response.ok) {
						const userData = await response.json();
						const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

						const user: Partial<User> = {
							id: tokenPayload.sub,
							username: userData.sub || tokenPayload.username,
							email: userData.email,
							role: tokenPayload.roles || []
						};

						set({ user });
					}
				} catch (error) {
					console.error('Failed to get current user:', error);
				}
			},
			clearError: () => {
				set({ error: null })
			},
			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},
			initializeAuth: async () => {
				const { accessToken, refreshToken } = get();

				if (!accessToken) {
					return;
				}

				try {
					set({ isLoading: true })
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
				} finally {
					set({ isLoading: false })
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