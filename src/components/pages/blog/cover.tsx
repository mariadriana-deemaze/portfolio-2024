import { useEffect, useRef } from 'react';

interface CoverProps {
	src: string;
	alt: string;
}

export function Cover({ src, alt }: CoverProps) {
	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let raf: number;

		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				if (!innerRef.current?.parentElement) return;
				const r = innerRef.current.parentElement.getBoundingClientRect();
				const vh = window.innerHeight || 1;
				const prog = (vh - r.top) / (vh + r.height);
				innerRef.current.style.transform = `translateY(${(prog - 0.5) * 10}%)`;
			});
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div className="animate-fade-in-left delay-300 relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden bg-muted h-[clamp(300px,52vh,600px)]">
			<div className="absolute inset-y-[-10%] inset-x-0 will-change-transform" ref={innerRef}>
				<img
					src={src}
					alt={alt}
					loading="eager"
					fetchPriority="high"
					className="block size-full object-cover"
				/>
			</div>
			<div
				className="absolute inset-0"
				style={{
					background:
						'linear-gradient(180deg, transparent 65%, color-mix(in srgb, var(--background) 60%, transparent))'
				}}
			/>
		</div>
	);
}
