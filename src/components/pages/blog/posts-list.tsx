
import { CalendarIcon } from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ReactLenis } from 'lenis/react';
import { useRef, useState, type MouseEvent } from 'react';

import type { BlogPost } from '@/data/blog';

import { Badge } from '@/components/ui/badge';
import ReadMoreCursor from '@/components/ui/read-more-cursor';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { toBlogSlug } from '@/utils/routes';

export default function PostsList({ posts }: { posts: BlogPost[] }) {
	const [hoveringPost, setHoveringPost] = useState<BlogPost | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = (post: BlogPost) => {
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
							className="w-full border-b py-4 cursor-none"
							onMouseDown={() => handleMouseEnter(post)}
							onMouseEnter={() => handleMouseEnter(post)}
							onMouseLeave={(e) => handleMouseLeave(e)}
						>
							<Link
								to={toBlogSlug(post.slug)}
								className="block"
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
														className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity"
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
							</Link>
						</li>
					))}
				</ul>
			</section>

			<ReadMoreCursor isVisible={hoveringPost !== null} />
		</ReactLenis>
	);
}
