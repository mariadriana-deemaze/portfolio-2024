import type { CSSProperties } from 'react';

import { cn } from '@/utils/utils';

/*
  Soft rays rising from an origin below the box, in brand orange.

  Each ray is a blurred gradient wedge pinned to a shared origin under the
  bottom edge, rotated out into a fan. Sway and flicker run on different
  periods per ray so the fan never settles into a repeating pattern. The
  global prefers-reduced-motion rule flattens both animations.
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

type RayVars = CSSProperties & {
	'--ray-angle': string;
	'--ray-swing': string;
	'--ray-dim': string;
	'--ray-lit': string;
};

export function HeroBeam({ className }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={cn('absolute inset-0 overflow-hidden bg-[#0d0c0b]', className)}
		>
			{RAYS.map((ray) => (
				<div
					key={ray.angle}
					className="absolute bottom-[-45%] left-1/2 h-[175%] origin-bottom -translate-x-1/2 blur-[11px] motion-reduce:blur-[14px]"
					style={
						{
							width: `${ray.width}%`,
							'--ray-angle': `${ray.angle}deg`,
							'--ray-swing': `${ray.swing}deg`,
							'--ray-dim': String(ray.dim),
							'--ray-lit': String(ray.lit),
							rotate: `${ray.angle}deg`,
							opacity: ray.dim,
							background:
								'linear-gradient(to top, color-mix(in srgb, var(--color-orange-primary) 86%, #fff) 0%, var(--color-orange-primary) 12%, color-mix(in srgb, var(--color-orange-light) 52%, transparent) 34%, color-mix(in srgb, var(--color-orange-muted) 16%, transparent) 58%, transparent 82%)',
							animation: `beam-sway ${ray.sway}s var(--ease-in-out) infinite, beam-flicker ${ray.flicker}s var(--ease-in-out) infinite`
						} as RayVars
					}
				/>
			))}

			{/* Haze pooling where the rays converge, and a vignette so the fan
			    fades out before it reaches the frame rules. */}
			<div
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 46% 30% at 50% 112%, color-mix(in srgb, var(--color-orange-light) 32%, transparent) 0%, transparent 72%)'
				}}
			/>
			<div
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 120% 105% at 50% 102%, transparent 58%, #0d0c0b 100%)'
				}}
			/>

			{/* Film grain over the whole panel, so the gradients read as light on
			    stock rather than as flat CSS. */}
			<div
				className="absolute inset-0 opacity-[0.11] mix-blend-screen"
				style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
			/>
		</div>
	);
}
