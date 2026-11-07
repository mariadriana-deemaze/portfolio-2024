import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '@/utils/utils';

/*
  Soft rays rising from an origin below the box, in brand orange.

  Each ray is a blurred gradient wedge pinned to a shared origin under the
  bottom edge, rotated out into a fan. Sway and flicker run on different
  periods per ray so the fan never settles into a repeating pattern. The
  global prefers-reduced-motion rule flattens both animations.

  The panel sits on the page background, so the fan reads as light on a dark
  stock and as ink on a light one.
*/

const GRAIN =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";

const RAYS = [
	{ angle: -32, width: 13, swing: 2.4, sway: 15, flicker: 7, dim: 0.26, lit: 0.5 },
	{ angle: -22, width: 9, swing: 1.6, sway: 19, flicker: 9, dim: 0.34, lit: 0.62 },
	{ angle: -13, width: 15, swing: 2.8, sway: 13, flicker: 11, dim: 0.3, lit: 0.58 },
	{ angle: -5, width: 8, swing: 1.2, sway: 21, flicker: 8, dim: 0.42, lit: 0.72 },
	{ angle: 4, width: 12, swing: 2.1, sway: 17, flicker: 10, dim: 0.38, lit: 0.66 },
	{ angle: 12, width: 9, swing: 1.8, sway: 23, flicker: 12, dim: 0.3, lit: 0.56 },
	{ angle: 21, width: 14, swing: 2.6, sway: 14, flicker: 9, dim: 0.26, lit: 0.52 },
	{ angle: 31, width: 10, swing: 2.0, sway: 20, flicker: 13, dim: 0.22, lit: 0.44 }
];

/* How far the pointer reaches across the fan. --beam-hot decides how hot a
   ray gets when it lands right under the cursor. */
const CURSOR_SPREAD = 44;
const CURSOR_REACH = 24;

type RayVars = CSSProperties & Record<`--${string}`, string>;

function useCursorBoost() {
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const rays = Array.from(panel.querySelectorAll<HTMLElement>('[data-ray]'));
		let raf: number | null = null;
		let pointerAngle: number | null = null;

		const apply = () => {
			raf = null;
			for (const ray of rays) {
				const angle = Number(ray.dataset.ray);
				if (pointerAngle === null) {
					ray.style.setProperty('--ray-near', '0');
					continue;
				}
				const distance = Math.abs(angle - pointerAngle);
				const nearness = Math.max(0, 1 - distance / CURSOR_REACH);
				ray.style.setProperty('--ray-near', nearness.toFixed(3));
			}
		};

		const schedule = () => {
			if (raf === null) raf = requestAnimationFrame(apply);
		};

		/* The scrim and the mark sit above the fan, so pointer events never
		   reach it. Track the window and test the panel's bounds instead. */
		const onMove = (e: PointerEvent) => {
			const rect = panel.getBoundingClientRect();
			const inside =
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;

			pointerAngle = inside ? ((e.clientX - rect.left) / rect.width - 0.5) * CURSOR_SPREAD : null;
			schedule();
		};

		window.addEventListener('pointermove', onMove);

		return () => {
			window.removeEventListener('pointermove', onMove);
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, []);

	return panelRef;
}

export function HeroBeam({ className }: { className?: string }) {
	const panelRef = useCursorBoost();

	return (
		<div
			ref={panelRef}
			aria-hidden="true"
			className={cn('absolute inset-0 overflow-hidden bg-background', className)}
		>
			{RAYS.map((ray) => (
				<div
					key={ray.angle}
					data-ray={ray.angle}
					className="absolute bottom-[-45%] left-1/2 h-[175%] w-[var(--ray-width)] -translate-x-1/2 [transition:filter_450ms_var(--ease-out),opacity_450ms_var(--ease-out)]"
					style={
						{
							'--ray-width': `${ray.width}%`,
							'--ray-near': '0',
							mixBlendMode: 'var(--beam-blend)' as CSSProperties['mixBlendMode'],
							opacity: 'calc(0.84 + 0.16 * var(--ray-near))',
							filter:
								'blur(calc(11px - 4px * var(--ray-near))) brightness(calc(1 + (var(--beam-hot) - 1) * var(--ray-near)))'
						} as RayVars
					}
				>
					<div
						className="absolute inset-0 origin-bottom"
						style={
							{
								'--ray-angle': `${ray.angle}deg`,
								'--ray-swing': `${ray.swing}deg`,
								'--ray-dim': `calc(${ray.dim} * var(--beam-density))`,
								'--ray-lit': `calc(${ray.lit} * var(--beam-density))`,
								rotate: `${ray.angle}deg`,
								opacity: `calc(${ray.dim} * var(--beam-density))`,
								background: 'var(--beam-ray)',
								animation: `beam-sway ${ray.sway}s var(--ease-in-out) infinite, beam-flicker ${ray.flicker}s var(--ease-in-out) infinite`
							} as RayVars
						}
					/>
				</div>
			))}

			{/* Haze pooling where the rays converge, and a vignette so the fan
			    fades out before it reaches the frame rules. */}
			<div
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 46% 30% at 50% 112%, var(--beam-haze) 0%, transparent 72%)'
				}}
			/>
			<div
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 120% 105% at 50% 102%, transparent 58%, hsl(var(--background)) 100%)'
				}}
			/>

			{/* Film grain over the whole panel, so the gradients read as light on
			    stock rather than as flat CSS. */}
			<div
				className="absolute inset-0 opacity-[0.11] mix-blend-multiply dark:mix-blend-screen"
				style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
			/>
		</div>
	);
}
