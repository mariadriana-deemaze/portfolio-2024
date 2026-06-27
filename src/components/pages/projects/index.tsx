import { ReactLenis } from 'lenis/react';
import { useMemo, useState } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { ImageCard } from '@/components/ui/image-card';
import { ScrollFadeReveal } from '@/components/ui/section-reveal';
import { StaggerText } from '@/components/ui/stagger-text';
import type { Project } from '@/data/projects';
import { cn } from '@/utils/utils';

function ProjectCard({ project, i, featured }: { project: Project; i: number; featured: boolean }) {
	const gradient = project.colors?.length
		? `linear-gradient(145deg, ${project.colors[0]}, ${project.colors[1] ?? project.colors[0]} 55%, ${project.colors[2] ?? project.colors[0]})`
		: undefined;

	return (
		<ImageCard
			href={`/projects/${project.slug}`}
			image={project.coverImage?.url}
			gradient={gradient}
			featured={featured}
			index={i}
			eagerImage={featured}
		>
			<span
				className={cn(
					'inline-block font-mono text-[10px] tracking-[0.06em] uppercase text-white/90 rounded-full px-[10px] py-[4px] mb-[12px]',
					'bg-white/15 backdrop-blur-[4px]',
					'opacity-0 translate-y-[8px]',
					'transition-[opacity,translate] duration-[450ms] [transition-timing-function:var(--ease-out)]',
					'group-hover:opacity-100 group-hover:translate-y-0',
					'[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0',
					'motion-reduce:transition-none'
				)}
			>
				{project.medium}
			</span>

			<h3
				className={cn(
					'm-0 font-clash font-medium leading-[1.02] tracking-[-0.025em] text-white',
					'transition-[translate] duration-[500ms] [transition-timing-function:var(--ease-out)] group-hover:-translate-y-[2px]',
					'motion-reduce:transition-none',
					featured ? 'text-[clamp(34px,5vw,64px)]' : 'text-[clamp(24px,3vw,38px)]'
				)}
			>
				{project.title}
			</h3>

			<p
				className={cn(
					'm-0 mt-[10px] font-mono text-[13px] leading-[1.55] text-white/90 max-w-[440px] overflow-hidden',
					'max-h-0 opacity-0',
					'transition-[max-height,opacity] duration-[550ms] [transition-timing-function:var(--ease-out)]',
					'group-hover:max-h-[80px] group-hover:opacity-100',
					'[@media(hover:none)]:max-h-[90px] [@media(hover:none)]:opacity-100',
					'motion-reduce:max-h-[90px] motion-reduce:opacity-100'
				)}
			>
				{project.description}
			</p>

			<div className="flex items-center gap-[14px] mt-[16px]">
				<div className="flex gap-[6px] flex-wrap">
					{project.tags.map((tag) => (
						<span
							key={tag}
							className="font-mono text-[10px] text-white border border-white/40 rounded-full px-[9px] py-[3px]"
						>
							{tag}
						</span>
					))}
				</div>
				<span className="font-mono text-[11px] text-white/75 ml-auto">{project.year}</span>
			</div>
		</ImageCard>
	);
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
	const [selectedFilter, setSelectedFilter] = useState('All');

	// Extract unique medium values, preserving order of appearance
	const mediums = useMemo(() => {
		const seen = new Set<string>();
		const unique: string[] = [];
		for (const p of projects) {
			if (!seen.has(p.medium)) {
				seen.add(p.medium);
				unique.push(p.medium);
			}
		}
		return ['All', ...unique];
	}, [projects]);

	// Filter projects based on selected medium
	const filteredProjects = useMemo(() => {
		if (selectedFilter === 'All') return projects;
		return projects.filter((p) => p.medium === selectedFilter);
	}, [projects, selectedFilter]);

	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<div className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)]">
				<header className="pt-[clamp(100px,14vw,138px)]">
					<ScrollFadeReveal onLoadVisibility>
						<div className="flex items-center gap-[12px] font-mono text-[12px] tracking-[0.06em] uppercase text-[var(--color-orange-primary)] mb-[22px]">
							<span
								className="w-[40px] h-px bg-[var(--color-orange-primary)] opacity-50 shrink-0"
								aria-hidden="true"
							/>
							Selected work · 2022—{new Date().getFullYear()}
						</div>
						<h1 className="m-0 font-clash font-medium text-[clamp(52px,9.5vw,128px)] leading-[0.9] tracking-[-0.038em] text-foreground break-words">
							<StaggerText text="Things I've" autoReveal baseDelay={0.08} letterDelay={0.028} />
							<br />
							<em className="not-italic font-normal italic text-[var(--color-orange-primary)]">
								<StaggerText text="built" autoReveal baseDelay={0.39} letterDelay={0.028} />
							</em>
						</h1>
						<div className="flex items-end justify-between gap-[28px] flex-wrap mt-[30px]">
							<p className="m-0 font-clash font-normal text-[clamp(18px,2.4vw,26px)] leading-[1.4] tracking-[-0.01em] max-w-[520px] text-foreground text-pretty">
								Web and mobile products, end to end — design-minded front end with a solid back end.
							</p>
							<span className="font-mono text-[12px] text-muted-foreground whitespace-nowrap">
								<b className="text-[var(--color-orange-primary)] font-semibold">
									{filteredProjects.length}
								</b>{' '}
								{filteredProjects.length === 1 ? 'project' : 'projects'}
								{selectedFilter !== 'All' && ` · ${selectedFilter}`}
							</span>
						</div>
					</ScrollFadeReveal>
				</header>

				{projects.length > 1 && (
					<ScrollFadeReveal>
						<div className="flex items-center justify-between gap-[16px] flex-wrap mt-[clamp(48px,7vw,80px)] pb-[18px] border-b border-border">
							<span className="font-mono text-[12px] tracking-[0.06em] uppercase text-muted-foreground">
								Filter by
							</span>
							<div className="flex gap-[7px] flex-wrap">
								{mediums.map((medium) => (
									<button
										key={medium}
										onClick={() => setSelectedFilter(medium)}
										className={cn(
											'font-mono text-[12px] border rounded-full px-[14px] py-[6px] cursor-pointer',
											'transition-[background,border-color,color] duration-[250ms] ease-linear',
											selectedFilter === medium
												? 'bg-[var(--color-orange-primary)] border-[var(--color-orange-primary)] text-white'
												: 'bg-transparent border-border text-foreground hover:border-[var(--color-orange-primary)] hover:text-[var(--color-orange-primary)]'
										)}
									>
										{medium}
									</button>
								))}
							</div>
						</div>
					</ScrollFadeReveal>
				)}

				<ScrollFadeReveal>
					<div
						className={cn(
							'mt-[clamp(28px,4vw,44px)]',
							filteredProjects.length > 0 &&
								'grid grid-cols-2 max-sm:grid-cols-1 gap-[clamp(16px,2.4vw,28px)]'
						)}
					>
						{filteredProjects.length === 0 ? (
							<p className="font-mono text-[13px] text-muted-foreground py-[70px] px-[14px] text-center">
								Nothing here yet — more soon.
							</p>
						) : (
							filteredProjects.map((project, i) => (
								<ProjectCard
									key={project.slug}
									project={project}
									i={i}
									featured={selectedFilter === 'All' && i === 0}
								/>
							))
						)}
					</div>
				</ScrollFadeReveal>

				<ScrollFadeReveal>
					<section className="mt-[clamp(90px,13vw,150px)] border-t border-border pt-[clamp(48px,7vw,80px)] pb-[clamp(60px,9vw,110px)] flex items-end justify-between gap-[28px] flex-wrap">
						<h2 className="m-0 font-clash font-medium text-[clamp(30px,5vw,60px)] leading-[1.0] tracking-[-0.03em] max-w-[620px]">
							Have something you'd like to{' '}
							<em className="not-italic font-normal italic text-[var(--color-orange-primary)]">
								build
							</em>
							?
						</h2>
						<a
							href="/contact"
							className="group inline-flex items-center gap-[11px] font-mono text-[14px] text-white bg-[var(--color-orange-primary)] rounded-full px-[26px] py-[15px] no-underline whitespace-nowrap transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:var(--ease-out)] hover:-translate-y-[3px] hover:shadow-[0_20px_36px_-12px_color-mix(in_srgb,var(--color-orange-primary)_60%,transparent)] motion-reduce:transition-none"
						>
							Start a conversation
							<LuArrowUpRight className="w-[16px] h-[16px] transition-[translate] duration-[450ms] [transition-timing-function:var(--ease-out)] group-hover:translate-x-[4px] group-hover:-translate-y-[4px] motion-reduce:transition-none" />
						</a>
					</section>
				</ScrollFadeReveal>
			</div>
		</ReactLenis>
	);
}
