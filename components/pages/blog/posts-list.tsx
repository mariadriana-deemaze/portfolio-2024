'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import ReactLenis from '@studio-freight/react-lenis';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { BlogPost } from '@/data/blog';
import useMousePosition from '@/hooks/use-mouse-position';
import { cn } from '@/utils/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import '@/styles/blog/index.css';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PostsList({ posts }: { posts: BlogPost[] }) {
	const [hoveringPost, setHoveringPost] = useState<BlogPost | null>(null);

	const { x, y } = useMousePosition();

	const linkWrapperRef = useRef<HTMLDivElement>(null);
	const anchorLinkRef = useRef<HTMLAnchorElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = (post: BlogPost) => {
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
			<header className="mx-auto w-full max-w-2xl space-y-2 animate-fade-in-left delay-500 mb-10">
				<h1 className="font-clash font-bold text-5xl text-fade-grad">Blog</h1>
				<h4 className="font-clash font-medium text-md text-gray-500">Articles list</h4>
				<p className="pb-10 text-pretty font-mono text-sm text-foreground leading-5">
					My own personal and biased musings in thinkering around in engineering and
					design lands - take this as a fair warning.
				</p>
				<hr />
			</header>
			<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
				<ul className="flex flex-col gap-20 w-full h-full">
					{posts.length === 0 && (
						<p className="pb-10 text-pretty font-mono text-sm text-foreground leading-5 text-center">
							Looks empty here - enter the void
						</p>
					)}
					{posts.map((post) => (
						<li
							key={`blogpost-${post.slug}`}
							className="w-full border-b py-4"
							onMouseDown={() => handleMouseEnter(post)}
							onMouseEnter={() => handleMouseEnter(post)}
							onMouseLeave={(e) => handleMouseLeave(e)}
							onClick={() => anchorLinkRef.current?.click()}
						>
							<article>
								<ScrollFadeReveal onLoadVisibility>
									<h1 className="font-clash font-medium text-3xl text-fade-grad">
										{post.title}
									</h1>
									<time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500">
										<CalendarIcon />
										{format(new Date(post.date), 'do MMMM yyyy')}
									</time>
									<p className="my-4 font-mono text-sm text-foreground line-clamp-3">
										{post.description}
									</p>

									<div className="mt-6 flex flex-wrap gap-1">
										{post.keywords.map((keyword) => {
											return (
												<Badge
													className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default"
													variant="outline"
													key={post.slug + keyword}
												>
													<span>{keyword}</span>
												</Badge>
											);
										})}
									</div>
								</ScrollFadeReveal>
							</article>
						</li>
					))}
				</ul>
			</section>

			<div
				ref={linkWrapperRef}
				style={{
					left: `${(x || 0) - (linkWrapperRef.current?.clientWidth || 0) / 2}px`,
					top: `${(y || 0) - (linkWrapperRef.current?.clientHeight || 0) / 2}px`
				}}
				className={cn(
					'cursor-none pointer-events-none fixed ease-in-out transition-all duration-300 h-24 w-24 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 rounded-full flex flex-col justify-center',
					{
						'opacity-100 scale-100 -rotate-0': hoveringPost,
						'opacity-0 scale-50 -rotate-45': hoveringPost === null
					}
				)}
			>
				<Link
					ref={anchorLinkRef}
					className="cursor-none flex flex-row self-center -skew-y-12 leading-4 font-clash font-bold text-white uppercase"
					href={`blog/${hoveringPost?.slug}`}
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
				</Link>
			</div>
		</ReactLenis>
	);
}
