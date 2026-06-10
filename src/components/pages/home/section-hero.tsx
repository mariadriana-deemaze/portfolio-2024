import { useRef } from 'react';

import { NowPlaying } from '@/components/now-playing';
import { AnimatedMottos } from '@/components/pages/home/motto';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

const TILT_MAX = 16;

export const SectionHero = () => {
	const currentWork = data.work.find((w) => w.end === 'Present');
	const avatarRef = useRef<HTMLDivElement>(null);
	const borderRef = useRef<HTMLDivElement>(null);
	const shineRef = useRef<HTMLDivElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const el = avatarRef.current;
		const border = borderRef.current;
		const shine = shineRef.current;
		const highlight = highlightRef.current;
		if (!el || !border || !shine || !highlight) return;
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		el.style.transform = `perspective(500px) rotateY(${x * TILT_MAX}deg) rotateX(${-y * TILT_MAX}deg) scale3d(1.04,1.04,1.04)`;
		shine.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
		shine.style.opacity = '0.18';
		const px = (x + 0.5) * rect.width;
		const py = (y + 0.5) * rect.height;
		highlight.style.transform = `translate(${px - 40}px, ${py - 40}px)`;
		highlight.style.opacity = '0.45';
		const angle = Math.atan2(y, x) * (180 / Math.PI) - 90;
		border.style.background = `conic-gradient(from ${angle - 25}deg at 50% 50%, hsl(var(--border)) 0deg, rgba(241,90,36,0.9) 25deg, rgba(251,146,60,0.6) 40deg, hsl(var(--border)) 55deg, hsl(var(--border)) 360deg)`;
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
		<Section className="mt-20 animate-fade-in delay-100">
			<h1 className="font-clash font-medium text-[clamp(64px,20vw,116px)] leading-[0.92] tracking-[-0.035em] m-0">
				<span className="block w-fit pb-[0.04em] bg-[linear-gradient(to_right,var(--color-fg-base)_50%,transparent)] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent]">
					maria
				</span>
				<span className="block w-fit pb-[0.04em] bg-[linear-gradient(to_right,var(--color-orange-primary)_50%,transparent)] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent]">
					adriana
				</span>
			</h1>

			<div className="flex items-start justify-between gap-7 max-sm:gap-[22px] mt-[34px] flex-wrap">
				<div style={{ flex: '1 1 300px' }}>
					<div className="font-clash text-[19px] font-normal h-[26px] overflow-hidden flex items-center">
						<AnimatedMottos
							data={[...data.mottos]}
							className="bg-[linear-gradient(to_bottom,var(--color-orange-light),var(--color-orange-primary))] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] text-transparent"
						/>
					</div>

					<p className="font-mono text-sm leading-[1.7] max-w-[380px] mt-[14px] text-foreground m-0">
						{data.about}
					</p>

					<div className="flex gap-[14px] mt-[26px] print:hidden">
						{data.contact.social.map((social) => (
							<a
								key={social.name}
								href={social.url}
								target="_blank"
								rel="noreferrer"
								aria-label={social.name}
								className="w-[22px] h-[22px] text-muted-foreground grid place-items-center no-underline transition-[translate,color] duration-300 hover:-translate-y-[3px] hover:text-[var(--color-orange-primary)]"
							>
								<social.icon className="w-[18px] h-[18px]" aria-hidden="true" />
							</a>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-5 w-[340px] max-w-full">
					<div className="flex gap-6 items-start justify-between">
						<div className="flex flex-col gap-[14px] min-w-[168px] max-sm:min-w-0">
							<div>
								<div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
									Focus
								</div>
								<div className="font-mono text-[13px] text-foreground mt-[3px] whitespace-nowrap">
									{data.focus.join(' · ')}
								</div>
							</div>
							{currentWork && (
								<div>
									<div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
										Currently
									</div>
									<div className="font-mono text-[13px] text-foreground mt-[3px] whitespace-nowrap">
										<a
											href={currentWork.link}
											target="_blank"
											rel="noreferrer"
											className="hover:text-[var(--color-orange-primary)] transition-colors"
										>
											{currentWork.company}
										</a>
									</div>
								</div>
							)}
						</div>

						<div
							ref={avatarRef}
							className="relative flex-shrink-0 will-change-transform"
							style={{ transition: 'transform 0.6s var(--ease-out)' }}
							onMouseMove={handleMouseMove}
							onMouseLeave={handleMouseLeave}
						>
							<div
								ref={borderRef}
								className="rounded-[8px] p-px shadow-card"
								style={{ background: 'hsl(var(--border))', transition: 'background 0.2s ease' }}
							>
								<div className="relative w-[92px] h-[92px] rounded-[7px] overflow-hidden bg-background">
									<img
										className="w-full h-full object-cover block"
										alt={data.name}
										src="images/avatar.jpeg"
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
											background:
												'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)',
											transition: 'opacity 0.25s ease, transform 0.08s ease'
										}}
									/>
								</div>
							</div>
							<div
								className="absolute bottom-[-6px] right-[-6px] w-[30px] h-[30px] rounded-full bg-background border border-border grid place-items-center text-[15px] animate-[hero-wave_3.4s_ease-in-out_infinite] origin-[70%_80%] motion-reduce:animate-none"
								aria-hidden="true"
							>
								👋
							</div>
						</div>
					</div>

					<NowPlaying />
				</div>
			</div>

			<div
				className="flex items-center gap-[10px] mt-[56px] font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground print:hidden"
				aria-hidden="true"
			>
				<span className="relative w-px h-[38px] bg-border overflow-hidden shrink-0 hero-scrollcue-bar" />
				scroll to explore
			</div>
		</Section>
	);
};
