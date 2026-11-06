import { useEffect, useRef } from 'react';
import { LogoMark } from '@/components/logo-ma';
import {
	AVATAR_SIZE_DESKTOP,
	AVATAR_SIZE_MOBILE,
	AvatarCard
} from '@/components/pages/home/avatar-card';
import { HeroBeam } from '@/components/pages/home/hero-beam';
import { AnimatedMottos } from '@/components/pages/home/motto';
import { Section } from '@/components/ui/section';
import { useLocale } from '@/contexts/locale-context';
import { data } from '@/data/main';

/*
  Two layers drifting at different rates is what reads as depth — matching them
  would just slide the whole panel. The beam sits behind, so it moves least.
*/
const MARK_POINTER_DRIFT = 6;
const MARK_SCROLL_DRIFT = 0.04;
const BEAM_RATE = 0.4;

function useHeroParallax() {
	const markRef = useRef<HTMLDivElement>(null);
	const beamRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let mx = 0;
		let my = 0;
		let sy = 0;
		let raf: number | null = null;

		const apply = () => {
			raf = null;
			const x = mx * MARK_POINTER_DRIFT;
			const y = my * MARK_POINTER_DRIFT - sy * MARK_SCROLL_DRIFT;

			if (markRef.current) {
				markRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			}
			if (beamRef.current) {
				const bx = (x * BEAM_RATE).toFixed(2);
				const by = (y * BEAM_RATE).toFixed(2);
				beamRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
			}
		};

		const schedule = () => {
			if (raf === null) raf = requestAnimationFrame(apply);
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
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, []);

	return { markRef, beamRef };
}

export const SectionHero = () => {
	const { t, translations } = useLocale();
	const currentWork = data.work.find((w) => w.end === 'Present');
	const { markRef, beamRef } = useHeroParallax();

	return (
		<Section className="gap-y-0">
			{/* Flush with the frame rules, so only the bottom edge is drawn. */}
			<div className="relative h-[clamp(300px,44vh,420px)] lg:h-[60vh] overflow-hidden border-b border-border print:hidden">
				{/* Scaled up so the drift never pulls an edge into view. */}
				<div
					ref={beamRef}
					className="absolute inset-0 will-change-transform"
					style={{ scale: '1.06' }}
				>
					<HeroBeam />
				</div>

				{/* Scrim: the mark sits where the rays converge, so the panel is
				    darkened behind it to keep the silhouette readable. */}
				<div
					aria-hidden="true"
					className="absolute inset-0"
					style={{
						background:
							'radial-gradient(ellipse 38% 44% at 50% 46%, rgba(10,9,8,0.5) 0%, rgba(10,9,8,0.22) 50%, transparent 78%)'
					}}
				/>

				<div className="absolute inset-0 grid place-items-center">
					<div ref={markRef} className="will-change-transform">
						<LogoMark
							className="h-[clamp(64px,11vw,132px)] text-[#fff6e8] [&_path]:[fill-opacity:0.07] [&_path]:[stroke-width:0.32] [filter:drop-shadow(0_0_2px_rgba(6,5,4,0.9))_drop-shadow(0_0_9px_rgba(6,5,4,0.75))_drop-shadow(0_0_34px_color-mix(in_srgb,var(--color-orange-primary)_45%,transparent))]"
							aria-label={data.name}
						/>
					</div>
				</div>
			</div>

			<div className="mt-[clamp(28px,4vw,44px)] flex items-start justify-start gap-7 max-sm:gap-[22px] flex-wrap px-[var(--frame-pad)]">
				<div style={{ flex: '0 1 420px' }}>
					<h1 className="m-0 font-clash text-[clamp(28px,4vw,40px)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
						{data.name}
					</h1>

					<div className="font-clash text-[19px] font-normal h-[26px] overflow-hidden flex items-center">
						<AnimatedMottos
							data={translations.data.mottos}
							className="text-[var(--color-orange-primary)]"
						/>
					</div>

					<p className="font-mono text-sm leading-[1.7] max-w-[380px] mt-[14px] text-foreground m-0">
						{t('data.about')}
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
									{t('pages.home.hero.focus')}
								</div>
								<div className="font-mono text-[13px] text-foreground mt-[3px] whitespace-nowrap">
									{data.focus.join(' · ')}
								</div>
							</div>
							{currentWork && (
								<div>
									<div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
										{t('pages.home.hero.currently')}
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

						<AvatarCard size={AVATAR_SIZE_DESKTOP} className="max-sm:hidden" />
					</div>
				</div>

				<AvatarCard size={AVATAR_SIZE_MOBILE} className="sm:hidden" />
			</div>
		</Section>
	);
};
