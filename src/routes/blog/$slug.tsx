import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { Cover } from '@/components/pages/blog/cover';
import { MetaBar } from '@/components/pages/blog/meta-bar';
import { Badge } from '@/components/ui/badge';
import { BASE_URL } from '@/data/main';
import { createSeoHead } from '@/lib/head';
import { getPostFn } from '@/server-fns/content';
import { ROUTES } from '@/utils/routes';

export const Route = createFileRoute('/blog/$slug')({
	loader: async ({ params }) => {
		const postData = await getPostFn({ data: { slug: params.slug } });

		if (!postData.post) {
			throw notFound();
		}

		return {
			post: postData.post,
			postHtml: postData.postHtml ?? '',
			nextPost: postData.nextPost
		};
	},
	head: ({ loaderData, params }) =>
		createSeoHead({
			title: `${loaderData?.post?.title ?? 'Not found'} | Blog`,
			description: loaderData?.post?.description ?? 'The requested blog post could not be located.',
			alternates: {
				canonical: `${BASE_URL}/blog/${params.slug}`
			}
		}),
	component: BlogShowRoute,
	notFoundComponent: BlogPostNotFoundRoute
});

const DOT_COLORS = ['#ff5f57', '#febc2e', '#28c840'];

function useCodeBarExtraction(ref: React.RefObject<HTMLDivElement | null>) {
	useEffect(() => {
		const container = ref.current;
		if (!container) return;

		for (const pre of container.querySelectorAll('pre')) {
			if (pre.classList.contains('has-bar')) continue;

			const code = pre.querySelector('code');
			if (!code) continue;

			const firstLine = code.firstElementChild ?? code.firstChild;
			if (!firstLine) continue;

			const text = (firstLine.textContent ?? '').trim();
			if (!text.startsWith('//')) continue;

			const filename = text.replace(/^\/\/\s*/, '');
			if (!filename) continue;

			if (firstLine.nodeType === Node.TEXT_NODE) {
				firstLine.textContent = (firstLine.textContent ?? '').replace(/^\/\/.*\n?/, '');
			} else {
				const next = firstLine.nextSibling;
				firstLine.remove();
				if (next?.nodeType === Node.TEXT_NODE && next.textContent?.startsWith('\n')) {
					next.textContent = next.textContent.slice(1);
				}
			}

			const bar = document.createElement('div');
			bar.className = 'a-code-bar';
			for (const c of DOT_COLORS) {
				const dot = document.createElement('span');
				dot.className = 'a-code-bar-dot';
				dot.style.background = c;
				bar.appendChild(dot);
			}
			const name = document.createElement('span');
			name.className = 'a-code-bar-name';
			name.textContent = filename;
			bar.appendChild(name);

			pre.classList.add('has-bar');
			pre.insertBefore(bar, pre.firstChild);
		}
	}, [ref]);
}

function useTrackView(slug: string, initialViews: number) {
	const [views, setViews] = useState(initialViews);
	const tracked = useRef(false);

	const { mutate } = useMutation({
		mutationFn: () => fetch(`/api/blog/${slug}/views`, { method: 'POST' }).then((r) => r.json()),
		onSuccess: (data: { views?: number }) => {
			if (data.views != null) setViews(data.views);
		}
	});

	useEffect(() => {
		if (tracked.current) return;
		tracked.current = true;
		mutate();
	}, [mutate]);

	return views;
}

function BlogShowRoute() {
	const { post, postHtml, nextPost } = Route.useLoaderData();
	const {
		title,
		description,
		slug,
		cover,
		category,
		date,
		readingTime = 0,
		views = 0,
		keywords = []
	} = post;
	const liveViews = useTrackView(slug, views);
	const proseRef = useRef<HTMLDivElement>(null);
	useCodeBarExtraction(proseRef);

	const formattedDate = new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	return (
		<article className="w-full">
			<header className="mx-auto w-full max-w-4xl px-4 pt-[132px] sm:px-6">
				<Link
					to={ROUTES.blog}
					className="mb-[30px] inline-flex items-center gap-2 font-mono text-xs text-muted-foreground no-underline whitespace-nowrap transition-colors duration-300 hover:gap-[11px] hover:text-[var(--color-orange-primary)] sm:text-sm"
				>
					<span>←</span>
					<span>the journal</span>
				</Link>

				<div className="mb-[22px] flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.05em] text-muted-foreground">
					{category && (
						<>
							<span className="font-semibold uppercase tracking-[0.08em] text-[var(--color-orange-primary)]">
								{category}
							</span>
							<span className="size-1 rounded-full bg-muted-foreground opacity-60" />
						</>
					)}
					<span className="whitespace-nowrap">{formattedDate}</span>
				</div>

				<h1 className="animate-fade-in-left delay-200 m-0 font-clash text-foreground font-medium leading-[0.98] tracking-[-0.03em] text-[clamp(40px,6.4vw,78px)]">
					{title}
				</h1>

				<p className="animate-fade-in-left delay-300 mt-[26px] font-clash text-muted-foreground text-pretty font-normal leading-[1.4] tracking-[-0.01em] text-[clamp(19px,2.4vw,27px)]">
					{description}
				</p>

				<MetaBar slug={slug} title={title} readingTime={readingTime} views={liveViews} />
			</header>

			{cover && <Cover src={cover} alt={title} />}

			<div className="mx-auto w-full max-w-4xl px-4 a-body sm:px-6">
				<div
					ref={proseRef}
					className="prose dark:prose-invert"
					dangerouslySetInnerHTML={{ __html: postHtml }}
				/>

				{keywords.length > 0 && (
					<div className="mx-auto mt-2 flex max-w-[680px] flex-wrap gap-2">
						{keywords.map((tag: string) => (
							<Badge
								key={`${slug}-${tag}`}
								variant="outline"
								className="cursor-default px-3 py-1 text-[10px]"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</div>

			{nextPost && (
				<section className="relative left-1/2 mt-[clamp(80px,12vw,140px)] w-screen -translate-x-1/2 border-t border-border">
					<Link
						to="/blog/$slug"
						params={{ slug: nextPost.slug }}
						className="mx-auto block max-w-[1100px] p-[clamp(40px,7vw,80px)_max(24px,4vw)] text-foreground no-underline"
					>
						<div className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
							Next in the journal
						</div>
						<div className="mt-4 flex items-center justify-between gap-6">
							<div className="font-clash font-medium leading-none tracking-[-0.03em] text-[clamp(28px,5vw,60px)] transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[18px] group-hover:text-[var(--color-orange-primary)]">
								{nextPost.title}
							</div>
							<div className="grid size-[clamp(48px,7vw,74px)] flex-shrink-0 place-items-center rounded-full border-[1.5px] border-border text-[var(--color-orange-primary)] transition-[transform,background,color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [&>svg]:h-[42%] [&>svg]:w-[42%]">
								<LuArrowUpRight />
							</div>
						</div>
					</Link>
				</section>
			)}
		</article>
	);
}

function BlogPostNotFoundRoute() {
	return (
		<div className="animate-fade-in-left delay-500">
			<h1>Post not found</h1>
			<p>The requested blog post could not be located.</p>
			<p>
				<Link to={ROUTES.blog}>Back to blog</Link>
			</p>
		</div>
	);
}
