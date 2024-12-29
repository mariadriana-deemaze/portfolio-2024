'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import ReactLenis from '@studio-freight/react-lenis';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { BlogPost } from '@/data/blog';
import useMousePosition from '@/hooks/use-mouse-position';
import { cn } from '@/utils/utils';

export default function PostsList({ posts }: { posts: BlogPost[] }) {
	const [hoveringPost, setHoveringPost] = useState<BlogPost | null>(null);

	const { x, y } = useMousePosition();

	const linkRef = useRef<HTMLDivElement>(null);
	const lllinkRef = useRef<HTMLAnchorElement>(null);

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
			<header className="mx-auto w-full max-w-2xl space-y-8 animate-fade-in-left delay-500 mb-20">
				<h1 className="font-clash font-bold text-7xl text-fade-grad">Blog</h1>
				<h4 className="font-clash font-medium text-md text-gray-500">
					My own personal and biased musings in thinkering around in engineering and
					design lands - take this as a fair warning.
				</h4>
				<hr />
			</header>
			<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
				<ul className="flex flex-col gap-20 w-full h-full">
					{posts.map((post) => (
						<li
							key={`blogpost-${post.slug}`}
							className="w-full h-24 border-b"
							onMouseEnter={() => handleMouseEnter(post)}
							onMouseLeave={(e) => handleMouseLeave(e)}
							onClick={() => lllinkRef.current?.click()}
						>
							<ScrollFadeReveal onLoadVisibility>
								<h1 className="font-clash font-bold text-3xl text-fade-grad">
									{post.title}
								</h1>
								<h4 className="font-clash font-medium text-md text-gray-500">
									{post.description}
								</h4>
							</ScrollFadeReveal>
						</li>
					))}
				</ul>
			</section>

			<div
				ref={linkRef}
				style={{
					left: `${(x || 0) - (linkRef.current?.clientWidth || 0) / 2}px`,
					top: `${(y || 0) - (linkRef.current?.clientHeight || 0) / 2}px`
				}}
				className={cn(
					'cursor-none pointer-events-none fixed ease-in-out transition-all duration-200 h-24 w-24 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 rounded-full flex flex-col justify-center',
					{
						'opacity-100 scale-100 -rotate-0': hoveringPost,
						'opacity-0 scale-50 -rotate-45': hoveringPost === null
					}
				)}
			>
				<Link
					ref={lllinkRef}
					className="flex flex-row self-center -skew-y-12 leading-4 font-clash font-bold text-white uppercase"
					href={`blog/${hoveringPost?.slug}`}
				>
					<span className="block w-14 text-wrap">Read more </span>
					<svg
						width="14"
						height="14"
						viewBox="0 0 17 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="self-center"
					>
						<path d="M2 1H16V15" stroke="currentColor" stroke-width="4"></path>
						<path
							d="M1 16.1953L16.1953 1.00001"
							stroke="currentColor"
							stroke-width="4"
						></path>
					</svg>
				</Link>
			</div>
		</ReactLenis>
	);
}
