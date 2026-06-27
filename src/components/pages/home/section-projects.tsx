import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuArrowUpRight } from 'react-icons/lu';

import { Chip } from '@/components/ui/chip';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { StaggerText } from '@/components/ui/stagger-text';
import type { Project } from '@/data/projects';

const TILT_RANGE = 30; // ±15deg — half applied each side of center

export const SectionProjects = ({ projects }: { projects: Project[] }) => {
	const cursorRef = useRef<HTMLDivElement>(null);
	const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
	const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
	const rafRef = useRef<number | null>(null);
	const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
	const [rowsRevealed, setRowsRevealed] = useState<boolean[]>(() => projects.map(() => false));

	useEffect(() => setPortalTarget(document.body), []);

	useEffect(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			setRowsRevealed((prev) => prev.map(() => true));
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.idx ?? -1);
						if (idx !== -1) {
							setRowsRevealed((prev) => {
								const next = [...prev];
								next[idx] = true;
								return next;
							});
						}
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.15 }
		);
		for (const el of rowRefs.current) {
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const fine = window.matchMedia('(pointer: fine)').matches;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fine || reduce) return;

		const tick = () => {
			rafRef.current = null;
			const p = posRef.current;
			p.tx += (p.x - p.tx) * 0.15;
			p.ty += (p.y - p.ty) * 0.15;
			if (cursorRef.current) {
				const tilt = (p.tx / (window.innerWidth || 1) - 0.5) * TILT_RANGE;
				cursorRef.current.style.transform = `translate(${p.tx}px, ${p.ty}px) translate(-50%, -50%) rotate(${tilt}deg)`;
			}
			if (Math.abs(p.x - p.tx) > 0.3 || Math.abs(p.y - p.ty) > 0.3) {
				rafRef.current = requestAnimationFrame(tick);
			}
		};

		const onMove = (e: MouseEvent) => {
			posRef.current.x = e.clientX;
			posRef.current.y = e.clientY;
			if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
		};

		window.addEventListener('mousemove', onMove);
		return () => {
			window.removeEventListener('mousemove', onMove);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	const showPreview = (i: number, e: React.MouseEvent) => {
		posRef.current.tx = e.clientX;
		posRef.current.ty = e.clientY;
		if (cursorRef.current) {
			const tilt = (e.clientX / (window.innerWidth || 1) - 0.5) * TILT_RANGE;
			cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) rotate(${tilt}deg)`;
			cursorRef.current.style.opacity = '1';
		}
		layerRefs.current.forEach((el, j) => {
			if (el) el.style.opacity = j === i ? '1' : '0';
		});
	};

	const hidePreview = () => {
		if (cursorRef.current) cursorRef.current.style.opacity = '0';
	};

	return (
		<Section>
			<SectionHeading
				num="04"
				title="Selected Work"
				count={
					<a
						href="/projects"
						className="no-underline hover:text-[var(--color-orange-primary)] transition-colors"
					>
						view all →
					</a>
				}
			/>

			{projects.length === 0 ? (
				<p className="font-mono text-[13px] text-muted-foreground py-10 text-center">
					No projects yet — check back soon.
				</p>
			) : (
				<div className="flex flex-col" onMouseLeave={hidePreview}>
					{projects.map((project, i) => (
						<a
							key={project.slug}
							ref={(el) => {
								rowRefs.current[i] = el;
							}}
							data-idx={i}
							href={`/projects/${project.slug}`}
							className="group relative grid grid-cols-[56px_1fr_auto_auto] items-center gap-[26px] px-[14px] py-[30px] border-b border-border last:border-b-0 text-inherit no-underline"
							onMouseEnter={(e) => showPreview(i, e)}
						>
							<span className="font-mono text-[12px] text-muted-foreground group-hover:text-[var(--color-orange-primary)] transition-colors duration-300">
								{String(i + 1).padStart(2, '0')}
							</span>

							<div className="min-w-0">
								<h3 className="m-0 font-clash font-medium text-[clamp(32px,6vw,70px)] leading-[0.98] tracking-[-0.032em] text-foreground group-hover:translate-x-5 group-hover:text-[var(--color-orange-primary)] transition-[translate,color] duration-[550ms] [transition-timing-function:var(--ease-out)]">
									<StaggerText text={project.title} revealed={rowsRevealed[i] ?? false} />
								</h3>
								<p className="m-0 mt-[5px] font-mono text-[13px] text-muted-foreground group-hover:translate-x-5 transition-[translate] duration-[550ms] delay-[30ms] [transition-timing-function:var(--ease-out)] max-sm:hidden">
									{project.description}
								</p>
							</div>

							<div className="flex flex-col items-end gap-[5px] max-sm:hidden">
								<Chip>{project.medium}</Chip>
								<span className="font-mono text-[11px] text-muted-foreground">{project.year}</span>
							</div>

							<LuArrowUpRight className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-[translate,color] duration-300 shrink-0" />
						</a>
					))}
				</div>
			)}

			{portalTarget &&
				createPortal(
					<div
						ref={cursorRef}
						className="fixed top-0 left-0 w-[220px] h-[148px] rounded-[12px] overflow-hidden pointer-events-none z-50 opacity-0 shadow-xl border border-border transition-opacity duration-300 [transition-timing-function:var(--ease-out)] motion-reduce:hidden"
						aria-hidden="true"
					>
						{projects.map((project, i) => (
							<div
								key={project.slug}
								ref={(el) => {
									layerRefs.current[i] = el;
								}}
								className="absolute inset-0 opacity-0 transition-opacity duration-200"
							>
								<div
									className="absolute inset-0"
									style={{
										background: `linear-gradient(145deg, ${project.colors[0]}, ${project.colors[1] ?? project.colors[0]} 55%, ${project.colors[2] ?? project.colors[0]})`
									}}
								/>
								{project.coverImage?.url && (
									<img
										src={project.coverImage.url}
										alt=""
										className="absolute inset-0 w-full h-full object-cover"
									/>
								)}
								<span className="absolute bottom-[10px] left-[12px] font-mono text-[10px] text-white/80 tracking-[0.06em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
									{project.medium} · {project.year}
								</span>
							</div>
						))}
					</div>,
					portalTarget
				)}
		</Section>
	);
};
