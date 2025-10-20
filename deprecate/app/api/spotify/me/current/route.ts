import { currentlyPlayingSong } from '../../lib';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Song } from '@/types/spotify';

export async function GET(request: NextRequest) {
	const response = await currentlyPlayingSong();

	if (response.status === 204 || response.status > 404) {
		return NextResponse.json(
			{ data: { isPlaying: false } },
			{
				status: 200,
				headers: response.headers
			}
		);
	}

	const song: Song = await response.json();

	const data = {
		isPlaying: song.is_playing,
		...(song.is_playing && {
			title: song.item?.name ?? 'No song playing',
			artist: (song?.item?.artists ?? ['No artist'])
				.map((_artist: { name: string }) => _artist.name)
				.join(', '),
			album: song.item?.album?.name ?? 'No album',
			albumUrl: song.item?.album?.external_urls?.spotify ?? 'No album url',
			albumImageUrl: song.item?.album?.images[0]?.url ?? 'No album image url',
			songUrl: song.item?.external_urls?.spotify ?? 'No song url'
		})
	};

	if (request.url) {
		revalidatePath(request.url);
	}

	const jsonResponse = NextResponse.json(
		{
			revalidated: false,
			now: Date.now(),
			data
		},
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return jsonResponse;
}
