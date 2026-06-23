import { Buffer } from 'node:buffer';
import { getEnv } from '@/lib/env';
import { setSpotifyTokens } from '@/server/routes/api/spotify/token-manager';
import type { SpotifyTokenResponse } from '@/server/routes/api/types/spotify';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export async function handleAuthorizeCallbackGet(request: Request): Promise<Response> {
	const env = getEnv();
	const url = new URL(request.url);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	if (error) {
		return Response.json({ error: `Spotify authorization denied: ${error}` }, { status: 400 });
	}

	if (!code || state !== env.SPOTIFY_ADMIN_SECRET) {
		return Response.json({ error: 'Invalid callback parameters' }, { status: 400 });
	}

	const callbackUrl = `${url.origin}/api/spotify/authorize/callback`;
	const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
		'base64'
	);

	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basic}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: callbackUrl
		})
	});

	if (!response.ok) {
		const body = await response.text();
		return Response.json(
			{ error: 'Token exchange failed', details: body },
			{ status: response.status }
		);
	}

	const data = (await response.json()) as SpotifyTokenResponse;

	if (!data.refresh_token) {
		return Response.json({ error: 'No refresh token in response' }, { status: 500 });
	}

	setSpotifyTokens(data.access_token, data.refresh_token, data.expires_in);

	return Response.json({
		success: true,
		message: 'Spotify tokens updated. The now-playing widget should resume shortly.'
	});
}
