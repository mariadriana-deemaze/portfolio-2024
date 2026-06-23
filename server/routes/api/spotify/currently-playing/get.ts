import { getSpotifyAccessToken } from '@/server/routes/api/spotify/token-manager';
import type {
	NowPlayingData,
	SpotifyArtist,
	SpotifyCurrentlyPlayingResponse
} from '@/server/routes/api/types/spotify';

function createNotPlayingResponse(status = 200): Response {
	return Response.json({ data: { isPlaying: false } }, { status });
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
	const accessToken = await getSpotifyAccessToken();

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
