import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useLayoutEffect, useRef } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { TakeoverCover } from '@/components/takeover/cover';
import { useLocale } from '@/contexts/locale-context';
import { useTakeover } from '@/contexts/takeover-context';
import type { NextProject } from '@/data/projects';

const PANEL_FULL_AT = 0.62;
const PRELOAD_AT = 0.25;
const NAVIGATE_AT = 0.95;
const ARM_BELOW = 0.35;

function useRunway(nextProject: NextProject) {
	const runwayRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const router = useRouter();
	const { begin } = useTakeover();
	const handedOver = useRef(false);
	const armed = useRef(false);
	const preloaded = useRef(false);

	useLayoutEffect(() => {
		handedOver.current = false;
		armed.current = false;
		preloaded.current = false;

		const runway = runwayRef.current;
		if (!runway) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const target = { slug: nextProject.slug, imageUrl: nextProject.coverImage?.url };
		let raf = 0;

		const update = () => {
			raf = 0;
			if (handedOver.current) return;

			const rect = runway.getBoundingClientRect();
			const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
			const grow = Math.min(progress / PANEL_FULL_AT, 1);

			runway.style.setProperty('--p', String(progress));
			runway.style.setProperty('--takeover', String(grow * grow * (3 - 2 * grow)));

			if (progress <= ARM_BELOW) armed.current = true;

			if (progress >= PRELOAD_AT && !preloaded.current) {
				preloaded.current = true;
				router
					.preloadRoute({ to: '/projects/$slug', params: { slug: nextProject.slug } })
					.catch(() => undefined);
			}

			if (armed.current && progress >= NAVIGATE_AT) {
				handedOver.current = true;
				begin(target);
				navigate({ to: '/projects/$slug', params: { slug: nextProject.slug } });
			}
		};

		const onScroll = () => {
			if (raf || handedOver.current) return;
			raf = requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		update();

		return () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
			runway.style.removeProperty('--p');
			runway.style.removeProperty('--takeover');
		};
	}, [nextProject, navigate, router, begin]);

	return runwayRef;
}

function NextProjectTakeover({ nextProject }: { nextProject: NextProject }) {
	const { t } = useLocale();
	const runwayRef = useRunway(nextProject);

	return (
		<div className="w-full px-[var(--frame-gutter)]">
			<div
				ref={runwayRef}
				className="takeover-runway relative mx-auto w-full min-h-[180vh] max-w-[var(--frame-max)] border-x border-border motion-reduce:min-h-0"
			>
				<div className="takeover-dim pointer-events-none fixed inset-0 z-[56] bg-black opacity-[calc(var(--takeover,0)*0.88)]" />

				<section className="takeover-panel fixed bottom-0 left-1/2 z-[57] flex -translate-x-1/2 flex-col overflow-hidden border-t-[length:calc(min(var(--takeover,0)*8,1)*1px)] border-border w-[min(100%_-_var(--frame-gutter)*2,var(--frame-max))] h-[calc(var(--takeover,0)*100vh)]">
					<Link
						to="/projects/$slug"
						params={{ slug: nextProject.slug }}
						className="group relative flex flex-1 flex-col justify-end overflow-hidden text-foreground no-underline"
					>
						<div className="takeover-cover pointer-events-none absolute inset-0 z-0 [--wipe:max(var(--reveal,0),var(--takeover,0))] [clip-path:inset(calc(100%_-_var(--wipe)*100%)_0_0_0)] [transition:--reveal_700ms_var(--ease-out)] group-hover:[--reveal:1]">
							<TakeoverCover imageUrl={nextProject.coverImage?.url} />
						</div>
						<div className="relative z-[1] w-full p-[clamp(48px,9vw,110px)_var(--frame-pad)]">
							<div className="font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground transition-colors duration-[400ms] ease-[var(--ease-out)] group-hover:text-[#5a2a12] dark:group-hover:text-[#e8a67a]">
								{t('pages.project-detail.next-project')}
							</div>
							<div className="mt-[18px] flex items-center justify-between gap-6">
								<div className="font-clash font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(40px,8vw,104px)] transition-[translate,color] duration-[550ms] ease-[var(--ease-out)] group-hover:translate-x-[22px] group-hover:text-[#2e1305] dark:group-hover:text-white motion-reduce:transition-none">
									{nextProject.title}
								</div>
								<div className="grid size-[clamp(54px,8vw,88px)] flex-shrink-0 place-items-center rounded-full border-[1.5px] border-border text-[var(--color-orange-primary)] transition-[rotate,scale,background,color,border-color] duration-[550ms] ease-[var(--ease-out)] group-hover:-rotate-45 group-hover:scale-[1.04] group-hover:bg-white group-hover:border-white group-hover:text-[var(--color-orange-primary)] motion-reduce:transition-none [&>svg]:h-[42%] [&>svg]:w-[42%]">
									<LuArrowUpRight />
								</div>
							</div>
						</div>
					</Link>
				</section>

				<div className="takeover-bridge pointer-events-none fixed inset-0 z-[58] overflow-hidden bg-background opacity-[clamp(0,calc((var(--p,0)_-_0.84)/0.11),1)]">
					<TakeoverCover imageUrl={nextProject.coverImage?.url} />
				</div>
			</div>
		</div>
	);
}

export { NextProjectTakeover };
