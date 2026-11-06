import { useRef } from 'react';

import { data } from '@/data/main';
import { cn } from '@/utils/utils';

const TILT_MAX = 16;

export const AVATAR_SIZE_DESKTOP = 92;
export const AVATAR_SIZE_MOBILE = 150;

const WaveBadge = () => (
	<div
		className="absolute bottom-[-6px] right-[-6px] w-[30px] h-[30px] rounded-full bg-background border border-border grid place-items-center text-[15px] animate-[hero-wave_3.4s_ease-in-out_infinite] origin-[70%_80%] motion-reduce:animate-none"
		aria-hidden="true"
	>
		👋
	</div>
);

export const AvatarCard = ({ size, className }: { size: number; className?: string }) => {
	const avatarRef = useRef<HTMLDivElement>(null);
	const borderRef = useRef<HTMLDivElement>(null);
	const shineRef = useRef<HTMLDivElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);
	const tiltRaf = useRef(0);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = avatarRef.current;
		const border = borderRef.current;
		const shine = shineRef.current;
		const highlight = highlightRef.current;
		if (!el || !border || !shine || !highlight) return;
		const { clientX, clientY } = e;
		if (tiltRaf.current) return;
		tiltRaf.current = requestAnimationFrame(() => {
			tiltRaf.current = 0;
			const rect = el.getBoundingClientRect();
			const x = (clientX - rect.left) / rect.width - 0.5;
			const y = (clientY - rect.top) / rect.height - 0.5;
			el.style.transform = `perspective(500px) rotateY(${x * TILT_MAX}deg) rotateX(${-y * TILT_MAX}deg) scale3d(1.04,1.04,1.04)`;
			shine.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
			shine.style.opacity = '0.18';
			const px = (x + 0.5) * rect.width;
			const py = (y + 0.5) * rect.height;
			highlight.style.transform = `translate(${px - 40}px, ${py - 40}px)`;
			highlight.style.opacity = '0.45';
			const angle = Math.atan2(y, x) * (180 / Math.PI) - 90;
			border.style.background = `conic-gradient(from ${angle - 25}deg at 50% 50%, hsl(var(--border)) 0deg, rgba(241,90,36,0.9) 25deg, rgba(251,146,60,0.6) 40deg, hsl(var(--border)) 55deg, hsl(var(--border)) 360deg)`;
		});
	};

	const handleMouseLeave = () => {
		if (avatarRef.current) avatarRef.current.style.transform = '';
		if (shineRef.current) {
			shineRef.current.style.opacity = '0';
			shineRef.current.style.transform = 'translate(0,0)';
		}
		if (highlightRef.current) highlightRef.current.style.opacity = '0';
		if (borderRef.current) borderRef.current.style.background = '';
	};

	return (
		<div
			ref={avatarRef}
			className={cn('relative w-fit flex-shrink-0 will-change-transform', className)}
			style={{ transition: 'transform 0.6s var(--ease-out)' }}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div
				ref={borderRef}
				className="rounded-[8px] p-px shadow-card"
				style={{ background: 'hsl(var(--border))', transition: 'background 0.2s ease' }}
			>
				<div
					className="relative rounded-[7px] overflow-hidden bg-background"
					style={{ width: size, height: size }}
				>
					<img
						className="w-full h-full object-cover block"
						alt={data.name}
						src="images/avatar.jpeg"
						width={size}
						height={size}
						loading="eager"
					/>
					<div
						ref={shineRef}
						className="absolute pointer-events-none mix-blend-overlay opacity-0 will-change-transform"
						style={{
							inset: '-50%',
							backgroundImage:
								'linear-gradient(105deg, hsla(0,50%,72%,0.9) 0%, hsla(60,50%,72%,0.9) 17%, hsla(120,50%,72%,0.9) 33%, hsla(180,50%,72%,0.9) 50%, hsla(240,50%,72%,0.9) 67%, hsla(300,50%,72%,0.9) 83%, hsla(360,50%,72%,0.9) 100%)',
							transition: 'opacity 0.4s ease, transform 0.12s ease'
						}}
					/>
					<div
						ref={highlightRef}
						className="absolute top-0 left-0 w-[80px] h-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 will-change-transform"
						style={{
							background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)',
							transition: 'opacity 0.25s ease, transform 0.08s ease'
						}}
					/>
				</div>
			</div>
			<WaveBadge />
		</div>
	);
};
