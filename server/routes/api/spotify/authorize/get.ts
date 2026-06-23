import { randomUUID } from 'node:crypto';
import { getEnv } from '@/lib/env';

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = 'user-read-currently-playing user-read-playback-state';
const STATE_TTL_MS = 600_000;

let pendingState = '';
let stateExpiresAt = 0;

export function verifyOAuthState(state: string | null): boolean {
	if (!state || !pendingState) return false;
	if (Date.now() > stateExpiresAt) return false;
	const valid = state === pendingState;
	pendingState = '';
	return valid;
}

export function handleAuthorizeGet(request: Request): Response {
	const env = getEnv();

	const url = new URL(request.url);
	const secret = url.searchParams.get('secret');

	if (!env.SPOTIFY_ADMIN_SECRET || secret !== env.SPOTIFY_ADMIN_SECRET) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const callbackUrl = `${url.origin}/api/spotify/authorize/callback`;

	pendingState = randomUUID();
	stateExpiresAt = Date.now() + STATE_TTL_MS;

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: env.SPOTIFY_CLIENT_ID,
		scope: SCOPES,
		redirect_uri: callbackUrl,
		state: pendingState
	});

	return Response.redirect(`${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`);
}
