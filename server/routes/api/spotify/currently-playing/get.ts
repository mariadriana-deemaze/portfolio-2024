import { Buffer } from 'node:buffer';
import { getEnv } from '@/lib/env';
import type {
	NowPlayingData,
	SpotifyArtist,
	SpotifyCurrentlyPlayingResponse
} from '@/server/routes/api/types/spotify';

function createNotPlayingResponse(status = 200): Response {
	return Response.json({ data: { isPlaying: false } }, { status });
}

async function getAccessToken(): Promise<string> {
	try {
		const env = getEnv();
		const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
			'base64'
		);

		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${basic}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: env.SPOTIFY_REFRESH_TOKEN
			})
		});

		if (!response.ok) {
			return '';
		}

		const data = (await response.json()) as { access_token?: string };

		return data.access_token ?? '';
	} catch (error) {
		console.error('Spotify token error:', error);
		return '';
	}
}

function mapNowPlayingData(song: SpotifyCurrentlyPlayingResponse): NowPlayingData {
	return {
		isPlaying: true,
		title: song.item?.name ?? 'No title',
		artist:
			(song.item?.artists ?? [])
				.map((artist: SpotifyArtist) => artist.name)
				.filter(Boolean)
				.join(', ') || 'No artist',
		album: song.item?.album?.name ?? 'No album',
		albumUrl: song.item?.album?.external_urls?.spotify ?? null,
		albumImageUrl: song.item?.album?.images?.[0]?.url ?? null,
		songUrl: song.item?.external_urls?.spotify ?? ''
	};
}

export async function handleCurrentlyPlayingGet(): Promise<Response> {
	const accessToken = await getAccessToken();

	if (!accessToken) {
		return createNotPlayingResponse();
	}

	try {
		const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (response.status === 204 || response.status >= 400) {
			return createNotPlayingResponse();
		}

		const song = (await response.json()) as SpotifyCurrentlyPlayingResponse;

		if (!song.item || !song.is_playing) {
			return createNotPlayingResponse();
		}

		return Response.json(
			{
				now: Date.now(),
				data: mapNowPlayingData(song)
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Spotify now playing error:', error);
		return createNotPlayingResponse(404);
	}
}
