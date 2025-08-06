import { User } from "@/types/user";
import { API_CONFIG } from "../api/api-config";

const OAUTH_CONFIG = {
	authServerUrl: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || '',
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
	redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
	postLogoutRedirectUrl: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || '',
	scope: 'openid profile email'
}

export const AuthService = {
	generateCodeVerifier: (): string => {
		const array = new Uint8Array(32);
		crypto.getRandomValues(array);
		return btoa(String.fromCharCode(...array))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=/g, '');
	},
	generateCodeChallenge: async (verifier: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(verifier);
		const hash = await crypto.subtle.digest('SHA-256', data);
		return btoa(String.fromCharCode(...new Uint8Array(hash)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=/g, '');
	},
	generateState: (): string => {
		return Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
	},
	buildAuthUrl: (codeChallenge: string, state: string) => {
		const params = new URLSearchParams({
			response_type: 'code',
			client_id: OAUTH_CONFIG.clientId,
			redirect_uri: OAUTH_CONFIG.redirectUri,
			scope: OAUTH_CONFIG.scope,
			state,
			code_challenge: codeChallenge,
			code_challenge_method: 'S256'
		});
		return `${OAUTH_CONFIG.authServerUrl}/oauth2/authorize?${params}`;
	},
	exchangeCodeForToken: async (code: string, codeVerifier: string) => {
		const res = await fetch(`${OAUTH_CONFIG.authServerUrl}/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${btoa(OAUTH_CONFIG.clientId + ':secret')}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: OAUTH_CONFIG.redirectUri,
				code_verifier: codeVerifier
			})
		});
		if (!res.ok) throw new Error('Token exchange failed');
		return res.json();
	},
	refreshAccessToken: async (refreshToken: string) => {
		const res = await fetch(`${OAUTH_CONFIG.authServerUrl}/oauth2/token`, {
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
		if (!res.ok) throw new Error('Token refresh failed');
		return res.json();
	},
	revokeToken: async (token: string) => {
		await fetch(`${OAUTH_CONFIG.authServerUrl}/oauth2/revoke`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${btoa(OAUTH_CONFIG.clientId + ':secret')}`
			},
			body: new URLSearchParams({
				token,
				token_type_hint: 'access_token'
			})
		});
	},
	getUserInfo: async (token: string) => {
		const res = await fetch(`${API_CONFIG.API_END_POINT.USER}/profile`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (!res.ok) throw new Error('Get Info failed');
		return res.json();
	},
	buildUserFromToken: async (token: string): Promise<Partial<User>> => {
		const tokenPayload = JSON.parse(atob(token.split('.')[1]));
		const userData = (await AuthService.getUserInfo(token)).data;
		return {
			id: tokenPayload.sub,
			username: userData?.username || tokenPayload.username || '',
			email: userData?.email || tokenPayload.email,
			avatar: userData?.avatar || '',
			role: tokenPayload.roles || []
		};
	}
}