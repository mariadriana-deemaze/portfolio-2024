import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { Cover } from '@/components/pages/blog/cover';
import { MetaBar } from '@/components/pages/blog/meta-bar';
import { PortableTextRenderer } from '@/components/portable-text';
import { NotFoundPage } from '@/components/ui/not-found-page';
import { BASE_URL } from '@/data/main';
import { createSeoHead } from '@/lib/head';
import { getPostFn } from '@/server-fns/content';
import { ROUTES, toBlogSlug } from '@/utils/routes';

export const Route = createFileRoute('/blog/$slug')({
	loader: async ({ params }) => {
		const postData = await getPostFn({ data: { slug: params.slug } });

		if (!postData.post) {
			throw notFound();
		}

		return {
			post: postData.post,
			nextPost: postData.nextPost
		};
	},
	head: ({ loaderData, params }) => {
		const post = loaderData?.post;
		const seo = post?.seo;
		const canonical = post?.canonicalUrl ?? `${BASE_URL}${toBlogSlug(params.slug)}`;
		return createSeoHead({
			title: seo?.title ?? `Maria Adriana | ${post?.title ?? 'Not found'}`,
			description:
				seo?.description ?? post?.description ?? 'The requested blog post could not be located.',
			image: seo?.ogImage ?? post?.coverImage?.url,
			url: canonical,
			type: 'article',
			alternates: { canonical }
		});
	},
	component: BlogShowRoute,
	notFoundComponent: BlogPostNotFoundRoute
});

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
	const { post, nextPost } = Route.useLoaderData();
	const {
		title,
		description,
		slug,
		coverImage,
		category,
		date,
		readingTime = 0,
		structuredBody,
		author
	} = post;
	const liveViews = useTrackView(slug, 0);

	const formattedDate = new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	return (
		<article className="w-full">
			<header className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] pt-[132px]">
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

				<h1 className="animate-fade-in-left delay-200 m-0 font-clash text-foreground font-medium leading-[0.98] tracking-[-0.03em] text-[clamp(40px,6.4vw,78px)] break-words">
					{title}
				</h1>

				<p className="animate-fade-in-left delay-300 mt-[26px] font-clash text-foreground text-pretty font-normal leading-[1.4] tracking-[-0.01em] text-[clamp(19px,2.4vw,27px)]">
					{description}
				</p>

				<MetaBar slug={slug} title={title} readingTime={readingTime} views={liveViews} />
			</header>

			{coverImage?.url && <Cover src={coverImage.url} alt={coverImage.alt ?? title} />}

			{structuredBody && (
				<div className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] a-body">
					<PortableTextRenderer body={structuredBody} />
				</div>
			)}

			<ArticleFooter author={author} />

			{nextPost && (
				<section className="relative left-1/2 mt-[clamp(80px,12vw,140px)] w-screen -translate-x-1/2 border-t border-border">
					<Link
						to="/blog/$slug"
						params={{ slug: nextPost.slug }}
						className="mx-auto block max-w-[1100px] p-[clamp(40px,7vw,80px)_var(--content-inset)] text-foreground no-underline"
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

function ArticleFooter({ author }: { author?: { name: string; avatar?: string; url?: string } }) {
	if (!author) return null;

	return (
		<footer className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-[clamp(48px,7vw,80px)]">
			<div className="flex items-center gap-4">
				{author.avatar && (
					<img
						src={author.avatar}
						alt={author.name}
						className="size-[52px] rounded-full object-cover"
						loading="lazy"
					/>
				)}
				<div>
					<div className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
						Written by
					</div>
					{author.url ? (
						<a
							href={author.url}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-[4px] block font-clash text-[17px] font-medium text-foreground no-underline hover:text-[var(--color-orange-primary)] transition-colors duration-300"
						>
							{author.name}
						</a>
					) : (
						<div className="mt-[4px] font-clash text-[17px] font-medium text-foreground">
							{author.name}
						</div>
					)}
				</div>
			</div>
		</footer>
	);
}

function BlogPostNotFoundRoute() {
	return (
		<NotFoundPage
			title="Post not found"
			description="The requested blog post could not be located."
			backTo={ROUTES.blog}
			backLabel="Back to the journal"
		/>
	);
}
