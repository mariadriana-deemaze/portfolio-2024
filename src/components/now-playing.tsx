import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import type { NowPlayingData } from '@/server/routes/api/types/spotify';

const EQ_FRAMES = [
	[5, 13, 8, 12, 6],
	[12, 6, 13, 7, 11],
	[8, 12, 5, 13, 9],
	[13, 7, 10, 6, 12]
] as const;

function HeadphonesIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 18v-6a9 9 0 0 1 18 0v6" />
			<path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
			<path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
		</svg>
	);
}

export const NowPlaying = () => {
	const [tick, setTick] = useState(0);
	const artRef = useRef<HTMLSpanElement>(null);

	const { data: nowPlaying } = useQuery<{ data: NowPlayingData }>({
		queryKey: ['nowPlaying'],
		queryFn: async () => fetch('/api/spotify/currently-playing').then((r) => r.json()),
		refetchInterval: 5000
	});

	const isPlaying = nowPlaying?.data.isPlaying;
	const albumImageUrl = nowPlaying?.data.albumImageUrl;

	useEffect(() => {
		if (!isPlaying) return;
		const id = setInterval(() => setTick((t) => t + 1), 480);
		return () => clearInterval(id);
	}, [isPlaying]);

	useEffect(() => {
		const el = artRef.current;
		if (!el) return;
		if (!isPlaying || !albumImageUrl) {
			el.style.boxShadow = '';
			return;
		}
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = albumImageUrl;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 1;
			canvas.height = 1;
			const ctx = canvas.getContext('2d');
			if (!ctx || !artRef.current) return;
			ctx.drawImage(img, 0, 0, 1, 1);
			const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
			artRef.current.style.boxShadow = `0 4px 10px -2px rgba(${r},${g},${b},0.5)`;
		};
	}, [isPlaying, albumImageUrl]);

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
					: 'Not playing — right now'
			}
		>
			<span
				ref={artRef}
				className={`relative w-[42px] h-[42px] rounded-[9px] shrink-0 grid place-items-center overflow-hidden transition-[scale,box-shadow] duration-[450ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.05] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:block [&_svg]:w-[22px] [&_svg]:h-[22px] ${isPlaying ? 'text-white bg-[linear-gradient(140deg,#1ed760,#169c46_55%,#0c6b30)]' : 'text-muted-foreground bg-muted'}`}
			>
				{isPlaying && nowPlaying?.data.albumImageUrl ? (
					<img src={nowPlaying.data.albumImageUrl} alt={nowPlaying.data.album || 'Album cover'} />
				) : (
					<HeadphonesIcon />
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
						{isPlaying ? 'Now playing' : 'music'}
					</span>
				</span>
				<span className="font-clash font-medium text-[15px] leading-[1.1] text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
					{isPlaying ? nowPlaying?.data.title : 'Not playing'}
				</span>
				<span className="font-mono text-[11px] text-muted-foreground mt-[1px]">
					{isPlaying ? nowPlaying?.data.artist : 'right now'}
				</span>
			</span>
		</a>
	);
};
