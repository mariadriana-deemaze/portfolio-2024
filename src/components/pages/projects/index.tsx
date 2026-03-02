
import { CalendarIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@tanstack/react-router';
import { ReactLenis } from 'lenis/react';
import { useRef, useState, type MouseEvent } from 'react';

import type { Project } from '@/data/projects';

import ReadMoreCursor from '@/components/ui/read-more-cursor';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { toProjectsSlug } from '@/utils/routes';

export default function ProjectsList({ projects }: { projects: Project[] }) {
	const [hoveringPost, setHoveringPost] = useState<Project | null>(null);
	const navigate = useNavigate();
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = (post: Project) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setHoveringPost(post);
	};

	const handleMouseLeave = (e: MouseEvent<HTMLLIElement>) => {
		const relatedTarget = e.relatedTarget as HTMLElement;
		if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
			return;
		}
		timeoutRef.current = setTimeout(() => {
			setHoveringPost(null);
		}, 500);
	};

	const handleNavigate = (slug: string) => {
		void navigate({ to: toProjectsSlug(slug) });
	};

	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<header className="mx-auto w-full max-w-2xl space-y-2 animate-fade-in-left delay-500 mb-20">
				<h1 className="font-clash font-bold text-5xl text-fade-grad">Projects</h1>
				<h4 className="font-clash font-medium text-md text-gray-500">Personal projects</h4>
				<p className="pb-10 text-pretty font-mono text-sm text-foreground leading-5">
					Things that I've worked on in the mean time.
				</p>
				<hr />
			</header>
			<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
				<ul className="flex flex-col gap-20 w-full h-full">
					{projects.map((project) => {
						const gradient = project.colors?.length
							? `linear-gradient(150deg, ${project.colors[0]} 0%, ${project.colors[1] ?? project.colors[0]} 35%, ${project.colors[2] ?? project.colors[1] ?? project.colors[0]} 100%)`
							: undefined

						return (
							<li
								key={`blogpost-${project.slug}`}
								className="w-full cursor-none"
								onMouseDown={() => handleMouseEnter(project)}
								onMouseEnter={() => handleMouseEnter(project)}
								onMouseLeave={(e) => handleMouseLeave(e)}
								onClick={() => handleNavigate(project.slug)}
							>
								<article>
									<ScrollFadeReveal onLoadVisibility>
										<div className="border-b pb-4">
											<div
												className="rounded-md border border-gray-400/30 dark:border-gray-200/10 p-[1px]"
												style={gradient ? { background: gradient } : undefined}
											>
												<div className="rounded-[0.45rem] overflow-hidden">
													<img
														className="block w-full h-auto"
														alt={`Hero image of the ${project.title} project.`}
														width={800}
														height={400}
														src={project.hero}
													/>
												</div>
											</div>
											<h1 className="font-clash font-medium text-3xl text-fade-grad mt-5">
												{project.title}
											</h1>
											<time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500">
												<CalendarIcon />
												{project.year}
											</time>
											<p className="py-4 font-mono text-sm text-foreground line-clamp-3">
												{project.description}
											</p>
										</div>
									</ScrollFadeReveal>
								</article>
							</li>
						)
					})}
				</ul>
			</section>

			<ReadMoreCursor isVisible={hoveringPost !== null} />
		</ReactLenis>
	);
}
