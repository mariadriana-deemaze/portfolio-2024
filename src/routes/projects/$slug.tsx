import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { LuArrowUpRight, LuGithub } from 'react-icons/lu';

import { PortableTextRenderer } from '@/components/portable-text';
import { getStackByName } from '@/components/stacks';
import { NotFoundPage } from '@/components/ui/not-found-page';
import { StaggerText } from '@/components/ui/stagger-text';
import { BASE_URL } from '@/data/main';
import { createSeoHead } from '@/lib/head';
import type { ResolvedGalleryItem, ResolvedMetric } from '@/lib/sanity-types';
import { getProjectFn } from '@/server-fns/content';
import { ROUTES, toProjectsSlug } from '@/utils/routes';
import { cn } from '@/utils/utils';

export const Route = createFileRoute('/projects/$slug')({
	loader: async ({ params }) => {
		const projectData = await getProjectFn({ data: { slug: params.slug } });

		if (!projectData.project) {
			throw notFound();
		}

		return {
			project: projectData.project,
			nextProject: projectData.nextProject
		};
	},
	head: ({ loaderData, params }) => {
		const project = loaderData?.project;
		const seo = project?.seo;
		const url = `${BASE_URL}${toProjectsSlug(params.slug)}`;
		return createSeoHead({
			title: seo?.title ?? `${project?.title ?? 'Project'} | Project`,
			description: seo?.description ?? project?.description ?? 'Project details and information.',
			image: seo?.ogImage ?? project?.coverImage?.url,
			url,
			type: 'article',
			alternates: { canonical: url }
		});
	},
	component: ProjectItemRoute,
	notFoundComponent: ProjectNotFoundRoute
});

function useCoverParallax(ref: React.RefObject<HTMLDivElement | null>) {
	useEffect(() => {
		const el = ref.current;
		const parent = el?.parentElement;
		if (!el || !parent) return;

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced) return;

		let raf: number;

		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				const r = parent.getBoundingClientRect();
				const vh = window.innerHeight || 1;
				const prog = (vh - r.top) / (vh + r.height);
				el.style.transform = `translateY(${(prog - 0.5) * 12}%)`;
				raf = 0;
			});
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	}, [ref]);
}

const SCROLL_RUNWAY_VH = 80;
const TRANSITION_START = 0.7;
const NAVIGATE_AT = 0.95;

function useNextProjectTransition(
	wrapperRef: React.RefObject<HTMLDivElement | null>,
	overlayRef: React.RefObject<HTMLDivElement | null>,
	slug: string
) {
	const navigate = useNavigate();
	const navigated = useRef(false);

	useEffect(() => {
		navigated.current = false;

		const wrapper = wrapperRef.current;
		const overlay = overlayRef.current;
		if (!wrapper || !overlay) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const vh = window.innerHeight;
		wrapper.style.minHeight = `${vh + (SCROLL_RUNWAY_VH * vh) / 100}px`;

		const section = wrapper.querySelector<HTMLElement>('[data-next-section]');
		if (!section) return;

		let raf = 0;

		const update = () => {
			raf = 0;
			if (navigated.current) return;

			const rect = wrapper.getBoundingClientRect();
			const currentVh = window.innerHeight;
			const scrolled = currentVh - rect.top;
			const progress = Math.max(0, Math.min(1, scrolled / rect.height));

			const growProgress = Math.min(progress / TRANSITION_START, 1);
			const eased = growProgress * growProgress * (3 - 2 * growProgress);
			section.style.minHeight = `${eased * currentVh}px`;

			if (progress > TRANSITION_START) {
				const fadeProgress = Math.min(
					(progress - TRANSITION_START) / (NAVIGATE_AT - TRANSITION_START),
					1
				);
				overlay.style.opacity = String(fadeProgress);
			} else {
				overlay.style.opacity = '0';
			}

			if (progress >= NAVIGATE_AT) {
				navigated.current = true;
				navigate({ to: '/projects/$slug', params: { slug } });
			}
		};

		const onScroll = () => {
			if (raf || navigated.current) return;
			raf = requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		update();

		return () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
			wrapper.style.minHeight = '';
			section.style.minHeight = '';
			overlay.style.opacity = '0';
		};
	}, [wrapperRef, overlayRef, slug, navigate]);
}

const META_KEY = 'font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground';
const META_VAL = 'font-mono text-[13px] text-foreground mt-[7px] leading-[1.55]';

const BTN_BASE =
	'inline-flex items-center gap-[9px] font-mono text-[13px] no-underline px-[18px] py-[11px] rounded-full';
const BTN_PRIMARY = `${BTN_BASE} bg-[var(--color-orange-primary)] border border-[var(--color-orange-primary)] text-white transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:var(--ease-out)] hover:-translate-y-[3px] hover:shadow-[0_16px_30px_-12px_color-mix(in_srgb,var(--color-orange-primary)_60%,transparent)] motion-reduce:transition-none`;
const BTN_GHOST = `${BTN_BASE} border border-border text-foreground transition-[translate,border-color,color] duration-[400ms] [transition-timing-function:var(--ease-out)] hover:-translate-y-[3px] hover:border-[var(--color-orange-primary)] hover:text-[var(--color-orange-primary)] motion-reduce:transition-none`;

function ProjectItemRoute() {
	const { project, nextProject } = Route.useLoaderData();
	const {
		title,
		year,
		description,
		coverImage,
		technologies = [],
		links = [],
		colors,
		medium,
		displayOrder,
		role,
		timeline,
		context,
		overview,
		problem,
		approach,
		statistics = [],
		gallery = [],
		structuredBody
	} = project;

	const coverRef = useRef<HTMLDivElement>(null);
	const transitionWrapperRef = useRef<HTMLDivElement>(null);
	const fadeOverlayRef = useRef<HTMLDivElement>(null);
	useCoverParallax(coverRef);
	useNextProjectTransition(transitionWrapperRef, fadeOverlayRef, nextProject?.slug ?? '');

	const heroGradient = colors?.length
		? `linear-gradient(150deg, ${colors[0]} 0%, ${colors[1] ?? colors[0]} 35%, ${colors[2] ?? colors[1] ?? colors[0]} 100%)`
		: undefined;

	const projectNum = displayOrder != null ? String(displayOrder).padStart(2, '0') : undefined;
	const hasMetaRow = role || timeline || context;
	const hasMetaSection = hasMetaRow || technologies.length > 0;

	return (
		<article className="w-full">
			<header className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] pt-[132px]">
				<div>
					<Link
						to={ROUTES.projects}
						className="mb-[30px] inline-flex items-center gap-2 font-mono text-xs text-muted-foreground no-underline whitespace-nowrap transition-colors duration-300 hover:gap-[11px] hover:text-[var(--color-orange-primary)] sm:text-sm"
					>
						<span>←</span>
						<span>back to work</span>
					</Link>

					<div className="mb-[22px] flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.05em] text-muted-foreground">
						{projectNum && (
							<span className="font-semibold text-[var(--color-orange-primary)]">{projectNum}</span>
						)}
						<span className="uppercase">{medium}</span>
						<span className="size-1 rounded-full bg-muted-foreground opacity-60" />
						<span>{year}</span>
					</div>

					<h1 className="animate-fade-in-left delay-200 m-0 font-clash text-foreground font-medium leading-[0.92] tracking-[-0.035em] text-[clamp(54px,10vw,132px)] break-words">
						<StaggerText text={title} autoReveal baseDelay={0.05} letterDelay={0.03} />
					</h1>

					<p className="animate-fade-in-left delay-300 mt-[28px] font-clash text-foreground text-pretty font-normal leading-[1.35] tracking-[-0.01em] text-[clamp(20px,2.6vw,30px)] max-w-[620px]">
						{description}
					</p>

					{hasMetaSection && (
						<div className="animate-fade-in-left delay-400 mt-[52px] border-t border-b border-border py-[26px]">
							{hasMetaRow && (
								<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-6">
									{role && (
										<div>
											<div className={META_KEY}>Role</div>
											<div className={META_VAL}>{role}</div>
										</div>
									)}
									{timeline && (
										<div>
											<div className={META_KEY}>Timeline</div>
											<div className={META_VAL}>{timeline}</div>
										</div>
									)}
									{context && (
										<div>
											<div className={META_KEY}>Context</div>
											<div className={META_VAL}>{context}</div>
										</div>
									)}
								</div>
							)}
							{technologies.length > 0 && (
								<div className={hasMetaRow ? 'mt-[22px]' : ''}>
									<div className={META_KEY}>Stack</div>
									<div className={cn(META_VAL, 'flex flex-wrap gap-1')}>
										{technologies.map(({ label }) => {
											const icon = getStackByName(label)?.icon ?? null;
											return (
												<span
													key={label}
													className="inline-flex items-center gap-1.5 border border-border rounded-full px-2 py-[2px] text-[11px]"
												>
													{icon}
													{label}
												</span>
											);
										})}
									</div>
								</div>
							)}
						</div>
					)}

					{links.length > 0 && (
						<div className="animate-fade-in-left delay-500 flex gap-[10px] mt-[30px] flex-wrap">
							{links.map((link, i) => {
								const isGithub = link.url.includes('github.com');
								return (
									<a
										key={link.url}
										href={link.url}
										target="_blank"
										rel="noreferrer"
										className={i === 0 && !isGithub ? BTN_PRIMARY : BTN_GHOST}
									>
										{isGithub && <LuGithub className="w-[15px] h-[15px]" />}
										{link.title}
										{!isGithub && <LuArrowUpRight className="w-[15px] h-[15px]" />}
									</a>
								);
							})}
						</div>
					)}
				</div>
			</header>

			{coverImage && (
				<div className="animate-fade-in-left delay-300 relative left-1/2 mt-16 w-screen -translate-x-1/2 overflow-hidden bg-muted h-[clamp(360px,64vh,760px)]">
					{heroGradient && (
						<div className="absolute inset-0" style={{ background: heroGradient, opacity: 0.3 }} />
					)}
					<div className="absolute inset-y-[-12%] inset-x-0 will-change-transform" ref={coverRef}>
						<img
							src={coverImage.url}
							alt={coverImage.alt ?? `${title} project cover`}
							width={coverImage.width}
							height={coverImage.height}
							loading="eager"
							fetchPriority="high"
							className="block size-full object-cover"
							{...(coverImage.lqip
								? {
										style: {
											backgroundImage: `url(${coverImage.lqip})`,
											backgroundSize: 'cover'
										}
									}
								: {})}
						/>
					</div>
					<div
						className="absolute inset-0"
						style={{
							background:
								'linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--background) 70%, transparent))'
						}}
					/>
					<span className="absolute left-[max(24px,5vw)] bottom-[22px] z-[2] font-mono text-[11px] text-white bg-black/45 border border-white/25 rounded-full px-3 py-[5px] backdrop-blur-[6px]">
						{title} — {year}
					</span>
				</div>
			)}

			{(overview || problem || approach) && (
				<section className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-[clamp(80px,12vw,150px)]">
					<div className="mx-auto max-w-[760px]">
						{overview && <CaseStudyBlock label="Overview" text={overview} />}
						{problem && (
							<CaseStudyBlock
								label="Problem"
								text={problem}
								className={overview ? 'mt-[48px]' : ''}
							/>
						)}
						{approach && (
							<CaseStudyBlock
								label="Approach"
								text={approach}
								className={overview || problem ? 'mt-[48px]' : ''}
							/>
						)}
					</div>
				</section>
			)}

			{statistics.length > 0 && <StatisticsGrid statistics={statistics} />}

			{structuredBody && (
				<section className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-[clamp(60px,9vw,110px)]">
					<div className="mx-auto max-w-[760px]">
						<PortableTextRenderer body={structuredBody} className="a-body" />
					</div>
				</section>
			)}

			{gallery.length > 0 && <ProjectGallery gallery={gallery} />}

			{nextProject && (
				<>
					<div
						ref={transitionWrapperRef}
						className="relative left-1/2 mt-[clamp(90px,14vw,170px)] w-screen -translate-x-1/2"
					>
						<section
							data-next-section
							className="sticky bottom-0 flex flex-col border-t border-border overflow-hidden"
						>
							<Link
								to="/projects/$slug"
								params={{ slug: nextProject.slug }}
								className="group relative flex flex-1 flex-col justify-end overflow-hidden text-foreground no-underline"
							>
								{nextProject.coverImage && (
									<div className="absolute inset-0 z-0 pointer-events-none [clip-path:polygon(0%_100%,100%_100%,100%_100%,0%_100%)] transition-[clip-path] duration-700 [transition-timing-function:var(--ease-out)] group-hover:[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]">
										<img
											src={nextProject.coverImage.url}
											alt=""
											className="absolute inset-0 size-full object-cover scale-[1.12] transition-transform duration-[1.1s] [transition-timing-function:var(--ease-out)] group-hover:scale-100"
										/>
										<div
											className="absolute inset-0"
											style={{
												background:
													'linear-gradient(115deg, color-mix(in srgb, var(--color-orange-primary) 88%, transparent) 0%, color-mix(in srgb, var(--color-orange-primary) 52%, transparent) 55%, rgba(20,8,3,0.5) 100%)'
											}}
										/>
									</div>
								)}
								<div className="relative z-[1] mx-auto w-full max-w-[1100px] p-[clamp(48px,9vw,110px)_var(--content-inset)]">
									<div className="font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground transition-colors duration-[400ms] ease-[var(--ease-out)] group-hover:text-[#5a2a12] dark:group-hover:text-[#e8a67a]">
										Next project
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
					</div>
					<div
						ref={fadeOverlayRef}
						className="pointer-events-none fixed inset-0 z-50 bg-background"
						style={{ opacity: 0 }}
					/>
				</>
			)}
		</article>
	);
}

const SECTION_LABEL =
	'mb-[26px] flex items-center gap-3 font-mono text-xs tracking-[0.06em] uppercase text-[var(--color-orange-primary)]';
const SECTION_LINE = 'block h-px w-10 bg-[var(--color-orange-primary)] opacity-50';

function CaseStudyBlock({
	label,
	text,
	className
}: {
	label: string;
	text: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<div className={SECTION_LABEL}>
				<span className={SECTION_LINE} />
				{label}
			</div>
			<p className="m-0 font-mono text-[14.5px] leading-[1.85] text-foreground text-pretty">
				{text}
			</p>
		</div>
	);
}

function StatisticsGrid({ statistics }: { statistics: ResolvedMetric[] }) {
	return (
		<section className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-[clamp(60px,9vw,110px)]">
			<div className="mx-auto max-w-[760px]">
				<div className={SECTION_LABEL}>
					<span className={SECTION_LINE} />
					Key metrics
				</div>
				<div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
					{statistics.map((stat) => (
						<div
							key={stat.label}
							className="rounded-2xl border border-border bg-[color-mix(in_srgb,var(--card)_42%,transparent)] p-[clamp(18px,2.4vw,28px)]"
						>
							<div className="font-clash text-[clamp(28px,4vw,44px)] font-medium leading-none tracking-[-0.02em] text-[var(--color-orange-primary)]">
								{stat.value}
							</div>
							<div className="mt-[10px] font-mono text-[11px] tracking-[0.06em] uppercase text-muted-foreground">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

const GALLERY_LAYOUT_CLASSES: Record<ResolvedGalleryItem['layout'], string> = {
	wide: 'col-span-full',
	half: 'col-span-1',
	third: 'col-span-1'
};

function ProjectGallery({ gallery }: { gallery: ResolvedGalleryItem[] }) {
	return (
		<section className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-[clamp(60px,9vw,110px)]">
			<div className={cn(SECTION_LABEL, 'mx-auto max-w-[1100px]')}>
				<span className={SECTION_LINE} />
				Gallery
			</div>
			<div className="grid grid-cols-2 gap-[clamp(12px,1.6vw,20px)] max-sm:grid-cols-1">
				{gallery.map((item) => {
					const { image } = item;
					if (!image?.url) return null;
					return (
						<figure key={image.url} className={cn('m-0', GALLERY_LAYOUT_CLASSES[item.layout])}>
							<div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-card)]">
								<img
									src={image.url}
									alt={image.alt ?? ''}
									width={image.width}
									height={image.height}
									loading="lazy"
									decoding="async"
									className="block w-full"
									{...(image.lqip
										? {
												style: {
													backgroundImage: `url(${image.lqip})`,
													backgroundSize: 'cover'
												}
											}
										: {})}
								/>
							</div>
							{image.caption && (
								<figcaption className="mt-[10px] text-center font-mono text-[11.5px] text-muted-foreground">
									{image.caption}
								</figcaption>
							)}
						</figure>
					);
				})}
			</div>
		</section>
	);
}

function ProjectNotFoundRoute() {
	return (
		<NotFoundPage
			title="Project not found"
			description="The requested project could not be located."
			backTo={ROUTES.projects}
			backLabel="Back to projects"
		/>
	);
}
