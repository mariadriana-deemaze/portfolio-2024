import { getEnv } from '@/lib/env';

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = 'user-read-currently-playing user-read-playback-state';

export function handleAuthorizeGet(request: Request): Response {
	const env = getEnv();

	const url = new URL(request.url);
	const secret = url.searchParams.get('secret');

	if (!env.SPOTIFY_ADMIN_SECRET || secret !== env.SPOTIFY_ADMIN_SECRET) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const callbackUrl = `${url.origin}/api/spotify/authorize/callback`;

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: env.SPOTIFY_CLIENT_ID,
		scope: SCOPES,
		redirect_uri: callbackUrl,
		state: env.SPOTIFY_ADMIN_SECRET
	});

	return Response.redirect(`${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`);
}
