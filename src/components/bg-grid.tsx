import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

const BLOB_TRANSITION = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';

export function BGGrid({ children }: { children?: ReactNode }) {
	const gridRef = useRef<HTMLDivElement>(null);
	const blob1Ref = useRef<HTMLImageElement>(null);
	const blob2Ref = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;

		let mx = 0,
			my = 0,
			sy = 0,
			raf: number | null = null;

		const apply = () => {
			raf = null;
			if (gridRef.current)
				gridRef.current.style.transform = `translate(${mx * 14}px, ${my * 14 - sy * 0.04}px)`;
			if (blob1Ref.current)
				blob1Ref.current.style.transform = `translate(${mx * 50}px, ${my * 40 + sy * 0.05}px)`;
			if (blob2Ref.current)
				blob2Ref.current.style.transform = `rotate(180deg) translate(${mx * 60}px, ${my * 48 - sy * 0.05}px)`;
		};

		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(apply);
		};

		const onMove = (e: MouseEvent) => {
			mx = e.clientX / window.innerWidth - 0.5;
			my = e.clientY / window.innerHeight - 0.5;
			schedule();
		};

		const onScroll = () => {
			sy = window.scrollY;
			schedule();
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<>
			{children}

			{/* Fixed background canvas */}
			<div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
				{/* Base gradient */}
				<div className="absolute inset-[-10%] bg-grad-base" />

				{/* Graph-paper grid — 1px lines, radial mask fades edges */}
				<div ref={gridRef} className="absolute inset-[-120px] bg-grid-lines" />

				{/* Colour blobs */}
				<img
					ref={blob1Ref}
					className="absolute -left-10 top-32 w-[300px] h-[600px] opacity-50"
					style={{ transition: BLOB_TRANSITION }}
					src="/images/color_grad.webp"
					alt=""
					aria-hidden="true"
				/>
				<img
					ref={blob2Ref}
					className="absolute -right-10 -top-32 w-[200px] h-[400px] opacity-[0.15]"
					style={{ transition: BLOB_TRANSITION, transform: 'rotate(180deg)' }}
					src="/images/color_grad.webp"
					alt=""
					aria-hidden="true"
				/>
			</div>

			{/* Vertical orange sidelines */}
			<div className="fixed top-0 bottom-0 z-0 pointer-events-none w-px left-[max(14px,4vw)] bg-brand opacity-[0.22]" />
			<div className="fixed top-0 bottom-0 z-0 pointer-events-none w-px right-[max(14px,4vw)] bg-brand opacity-[0.22]" />
		</>
	);
}
