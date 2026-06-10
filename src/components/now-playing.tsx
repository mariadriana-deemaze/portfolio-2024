import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { NowPlayingData } from '@/server/routes/api/types/spotify';

const EQ_FRAMES = [
	[5, 13, 8, 12, 6],
	[12, 6, 13, 7, 11],
	[8, 12, 5, 13, 9],
	[13, 7, 10, 6, 12]
] as const;

function SpotifyIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.1 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.4-1.02 15.84 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z" />
		</svg>
	);
}

export const NowPlaying = () => {
	const [tick, setTick] = useState(0);

	const { data: nowPlaying } = useQuery<{ data: NowPlayingData }>({
		queryKey: ['nowPlaying'],
		queryFn: async () => fetch('/api/spotify/currently-playing').then((r) => r.json()),
		refetchInterval: 5000
	});

	const isPlaying = nowPlaying?.data.isPlaying;

	useEffect(() => {
		if (!isPlaying) return;
		const id = setInterval(() => setTick((t) => t + 1), 480);
		return () => clearInterval(id);
	}, [isPlaying]);

	const heights = EQ_FRAMES[tick % 4] ?? EQ_FRAMES[0];
	const href = isPlaying ? nowPlaying?.data.songUrl : 'https://open.spotify.com';

	return (
		<a
			className="group flex items-center gap-3 no-underline text-inherit w-full transition-opacity duration-300 hover:opacity-[0.78]"
			href={href}
			target="_blank"
			rel="noreferrer"
			title={
				isPlaying
					? `${nowPlaying?.data.title} — ${nowPlaying?.data.artist}`
					: "What I'm listening to on Spotify"
			}
		>
			<span className="relative w-[42px] h-[42px] rounded-[9px] shrink-0 grid place-items-center text-white bg-[linear-gradient(140deg,#1ed760,#169c46_55%,#0c6b30)] overflow-hidden transition-[scale] duration-[450ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.05] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:block [&_svg]:w-[22px] [&_svg]:h-[22px]">
				{isPlaying && nowPlaying?.data.albumImageUrl ? (
					<img src={nowPlaying.data.albumImageUrl} alt={nowPlaying.data.album || 'Album cover'} />
				) : (
					<SpotifyIcon />
				)}
			</span>
			<span className="flex flex-col min-w-0 flex-1">
				<span className="flex items-center gap-2 mb-[3px]">
					<span className="flex gap-[2px] items-end h-[13px]">
						{heights.map((ht, i) => (
							<i
								key={i}
								className="w-[2.5px] bg-[#1db954] rounded-[1px] transition-[height] duration-300 inline-block"
								style={{ height: ht }}
							/>
						))}
					</span>
					<span className="font-mono text-[9px] tracking-[0.13em] uppercase text-muted-foreground whitespace-nowrap">
						{isPlaying ? 'Now playing' : 'Spotify'}
					</span>
				</span>
				<span className="font-clash font-medium text-[15px] leading-[1.1] text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
					{isPlaying ? nowPlaying?.data.title : 'Not playing'}
				</span>
				<span className="font-mono text-[11px] text-muted-foreground mt-[1px]">
					{isPlaying ? nowPlaying?.data.artist : 'Open Spotify'}
				</span>
			</span>
		</a>
	);
};
