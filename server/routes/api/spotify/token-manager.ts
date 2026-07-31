import { Buffer } from 'node:buffer';
import nodemailer from 'nodemailer';
import { getEnv } from '@/lib/env';
import type { SpotifyTokenError, SpotifyTokenResponse } from '@/server/routes/api/types/spotify';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPE = 'user-read-currently-playing';
const EXPIRY_BUFFER_MS = 120_000;

let cachedAccessToken = '';
let accessTokenExpiresAt = 0;
let tokenInvalid = false;
let expiryAlertSent = false;

function getBasicAuth(): string {
	const env = getEnv();
	return Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
}

/**
 * Emails a one-time heads-up (reusing the contact-form SMTP config) when the
 * refresh token hard-expires, so the widget doesn't silently die. Spotify's
 * 6-month expiry can only be cleared by re-running the OAuth consent flow and
 * dropping a fresh SPOTIFY_REFRESH_TOKEN into the env.
 */
async function sendExpiryAlert(): Promise<void> {
	if (expiryAlertSent) return;
	expiryAlertSent = true;

	const env = getEnv();

	const authorizeUrl = `${AUTHORIZE_ENDPOINT}?${new URLSearchParams({
		response_type: 'code',
		client_id: env.SPOTIFY_CLIENT_ID,
		scope: SPOTIFY_SCOPE,
		redirect_uri: 'YOUR_REGISTERED_REDIRECT_URI'
	}).toString()}`;

	const body = [
		'The now-playing widget stopped: Spotify returned invalid_grant for the refresh token.',
		'Refresh tokens hard-expire ~6 months after authorization and can only be renewed by re-consenting.',
		'',
		'Generate a new SPOTIFY_REFRESH_TOKEN:',
		'',
		'1. In your Spotify app dashboard (https://developer.spotify.com/dashboard), confirm a Redirect URI is registered. Replace YOUR_REGISTERED_REDIRECT_URI below with it (URL-encoded).',
		'',
		'2. Open this URL in a browser and approve the consent screen:',
		authorizeUrl,
		'',
		'3. Spotify redirects to your Redirect URI with a ?code=... query param. Copy that code.',
		'',
		'4. Exchange the code for tokens (run locally, filling in your own client id/secret and the code):',
		'   curl -X POST https://accounts.spotify.com/api/token \\',
		'     -u "SPOTIFY_CLIENT_ID:SPOTIFY_CLIENT_SECRET" \\',
		'     -d grant_type=authorization_code \\',
		'     -d code=CODE_FROM_STEP_3 \\',
		'     -d redirect_uri=YOUR_REGISTERED_REDIRECT_URI',
		'',
		'5. Copy "refresh_token" from the JSON response into the SPOTIFY_REFRESH_TOKEN env var, then redeploy.'
	].join('\n');

	try {
		const transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_PORT === 465,
			auth: { user: env.SMTP_FROM, pass: env.SMTP_PASSWORD }
		});

		await transporter.sendMail({
			from: env.SMTP_FROM,
			to: env.SMTP_TO,
			subject: 'Spotify refresh token expired — reauthorization needed',
			text: body
		});
		console.log('[spotify] Expiry alert email sent');
	} catch (error) {
		expiryAlertSent = false;
		console.error('[spotify] Failed to send expiry alert email:', error);
	}
}

async function refreshAccessToken(): Promise<string> {
	const env = getEnv();

	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${getBasicAuth()}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: env.SPOTIFY_REFRESH_TOKEN
		})
	});

	if (!response.ok) {
		const error: SpotifyTokenError = await response.json().catch(() => ({ error: 'unknown' }));
		if (error.error === 'invalid_grant') {
			tokenInvalid = true;
			console.error(
				'[spotify] Refresh token expired — generate a new SPOTIFY_REFRESH_TOKEN and redeploy'
			);
			void sendExpiryAlert();
		}
		return '';
	}

	const data: SpotifyTokenResponse = await response.json();
	cachedAccessToken = data.access_token;
	accessTokenExpiresAt = Date.now() + data.expires_in * 1000 - EXPIRY_BUFFER_MS;

	return cachedAccessToken;
}

/**
 * Returns a cached access token, refreshing it against Spotify only when the
 * cached one is missing or about to expire. Returns an empty string once the
 * refresh token is known-invalid, so callers degrade to "not playing" without
 * hammering the token endpoint.
 */
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
