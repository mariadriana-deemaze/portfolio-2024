'use client';

import ScrollFadeReveal from '@/components/ui/section-reveal';
import { BlogPost } from '@/data/blog';
import ReactLenis from '@studio-freight/react-lenis';
import Link from 'next/link';

export default function PostsList({ posts }: { posts: BlogPost[] }) {
	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<div className="grid grid-cols-2 gap-2 h-full">
				{posts.map((post) => (
					<ScrollFadeReveal key={`blogpost-${post.slug}`} onLoadVisibility>
						<div className="border border-red-600 min-h-56 min-w-96">
							<Link href={`blog/${post.slug}`}>{post.title}</Link>
						</div>
					</ScrollFadeReveal>
				))}
			</div>
		</ReactLenis>
	);
}
