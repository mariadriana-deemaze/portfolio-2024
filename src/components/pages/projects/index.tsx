
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { Project } from '@/data/projects';
import useElementSize from '@/hooks/use-element-size';
import useMousePosition from '@/hooks/use-mouse-position';
import { ROUTES, toProjectsSlug } from '@/utils/routes';
import { cn } from '@/utils/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { ReactLenis } from 'lenis/react';
import { useRef, useState } from 'react';

export default function ProjectsList({ projects }: { projects: Project[] }) {
	const [hoveringPost, setHoveringPost] = useState<Project | null>(null);

	const { x, y } = useMousePosition();

	const { ref: linkWrapperRef, size: linkWrapperSize } = useElementSize<HTMLDivElement>();
	const anchorLinkRef = useRef<HTMLAnchorElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = (post: Project) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setHoveringPost(post);
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
		const relatedTarget = e.relatedTarget as HTMLElement;
		if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
			return;
		}
		timeoutRef.current = setTimeout(() => {
			setHoveringPost(null);
		}, 500);
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
					{projects.map((project) => (
						<li
							key={`blogpost-${project.slug}`}
							className="w-full border-b"
							onMouseDown={() => handleMouseEnter(project)}
							onMouseEnter={() => handleMouseEnter(project)}
							onMouseLeave={(e) => handleMouseLeave(e)}
							onClick={() => anchorLinkRef.current?.click()}
						>
							<article>
								<ScrollFadeReveal onLoadVisibility>
									<img
										className="border border-gray-400/30 dark:border-gray-200/10 self-center rounded-md"
										alt={`Hero image of the ${project.title} project.`}
										width={800}
										height={400}
										src={project.hero}
									/>
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
								</ScrollFadeReveal>
							</article>
						</li>
					))}
				</ul>
			</section>

			<div
				ref={linkWrapperRef}
				style={{
					left: `${(x || 0) - linkWrapperSize.width / 2}px`,
					top: `${(y || 0) - linkWrapperSize.height / 2}px`
				}}
				className={cn(
					'cursor-none pointer-events-none fixed ease-in-out transition-all duration-300 h-24 w-24 bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 rounded-full flex flex-col justify-center',
					{
						'opacity-100 scale-100 -rotate-0': hoveringPost,
						'opacity-0 scale-50 -rotate-45': hoveringPost === null
					}
				)}
			>
				<a
					ref={anchorLinkRef}
					className="cursor-none flex flex-row self-center -skew-y-12 leading-4 font-clash font-bold text-white uppercase"
					href={hoveringPost ? toProjectsSlug(hoveringPost.slug) : ROUTES.projects}
				>
					<span className="block w-14 text-wrap">Read more </span>
					<svg
						width="14"
						height="14"
						viewBox="0 0 17 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="self-center cursor-none"
					>
						<path d="M2 1H16V15" stroke="currentColor" strokeWidth="4"></path>
						<path
							d="M1 16.1953L16.1953 1.00001"
							stroke="currentColor"
							strokeWidth="4"
						></path>
					</svg>
				</a>
			</div>
		</ReactLenis>
	);
}
