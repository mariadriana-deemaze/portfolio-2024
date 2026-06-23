import { Buffer } from 'node:buffer';
import { getEnv } from '@/lib/env';
import type { SpotifyTokenError, SpotifyTokenResponse } from '@/server/routes/api/types/spotify';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const EXPIRY_BUFFER_MS = 120_000;

let cachedAccessToken = '';
let accessTokenExpiresAt = 0;
let currentRefreshToken = '';
let tokenInvalid = false;

function getBasicAuth(): string {
	const env = getEnv();
	return Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
}

function initRefreshToken(): string {
	if (!currentRefreshToken) {
		currentRefreshToken = getEnv().SPOTIFY_REFRESH_TOKEN;
	}
	return currentRefreshToken;
}

async function persistRefreshToken(token: string): Promise<void> {
	const env = getEnv();
	if (!env.COOLIFY_API_TOKEN || !env.COOLIFY_API_URL || !env.COOLIFY_APP_UUID) return;

	const base = `${env.COOLIFY_API_URL}/api/v1/applications/${env.COOLIFY_APP_UUID}/envs`;
	const headers = {
		Authorization: `Bearer ${env.COOLIFY_API_TOKEN}`,
		'Content-Type': 'application/json'
	};
	const payload = { key: 'SPOTIFY_REFRESH_TOKEN', value: token };

	try {
		const res = await fetch(base, {
			method: 'PATCH',
			headers,
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const createRes = await fetch(base, {
				method: 'POST',
				headers,
				body: JSON.stringify(payload)
			});
			if (!createRes.ok) {
				console.error(`[spotify] Coolify env persistence failed: ${createRes.status}`);
				return;
			}
		}

		console.log('[spotify] Refresh token persisted to Coolify');
	} catch (error) {
		console.error('[spotify] Failed to persist refresh token to Coolify:', error);
	}
}

async function refreshAccessToken(): Promise<string> {
	const refreshToken = initRefreshToken();

	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${getBasicAuth()}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	if (!response.ok) {
		const error = (await response.json().catch(() => ({}))) as SpotifyTokenError;
		if (error.error === 'invalid_grant') {
			tokenInvalid = true;
			console.error(
				'[spotify] Refresh token expired — reauthorization required via /api/spotify/authorize'
			);
		}
		return '';
	}

	const data = (await response.json()) as SpotifyTokenResponse;

	cachedAccessToken = data.access_token;
	accessTokenExpiresAt = Date.now() + data.expires_in * 1000 - EXPIRY_BUFFER_MS;

	if (data.refresh_token && data.refresh_token !== currentRefreshToken) {
		console.log('[spotify] Refresh token rotated');
		currentRefreshToken = data.refresh_token;
		void persistRefreshToken(data.refresh_token);
	}

	return cachedAccessToken;
}

export async function getSpotifyAccessToken(): Promise<string> {
	if (tokenInvalid) return '';
	if (cachedAccessToken && Date.now() < accessTokenExpiresAt) return cachedAccessToken;

	try {
		return await refreshAccessToken();
	} catch (error) {
		console.error('[spotify] Token refresh error:', error);
		return '';
	}
}

export function setSpotifyTokens(
	accessToken: string,
	refreshToken: string,
	expiresIn: number
): void {
	cachedAccessToken = accessToken;
	accessTokenExpiresAt = Date.now() + expiresIn * 1000 - EXPIRY_BUFFER_MS;
	currentRefreshToken = refreshToken;
	tokenInvalid = false;
	void persistRefreshToken(refreshToken);
}
