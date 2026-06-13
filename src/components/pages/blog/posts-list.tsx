import { format } from 'date-fns';
import { ReactLenis } from 'lenis/react';
import { useMemo } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { ScrollFadeReveal } from '@/components/ui/section-reveal';
import type { BlogPost } from '@/data/blog';
import { toBlogSlug } from '@/utils/routes';
import { cn } from '@/utils/utils';

function FeaturedPostCard({ post }: { post: BlogPost }) {
	return (
		<a
			href={toBlogSlug(post.slug)}
			className={cn(
				'group relative block no-underline text-white rounded-[18px] overflow-hidden',
				'border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md',
				'transition-[translate,box-shadow,border-color] duration-[550ms] [transition-timing-function:var(--ease-out)]',
				'hover:-translate-y-[6px] hover:shadow-[0_44px_70px_-30px_rgba(0,0,0,0.36)]',
				'hover:border-white/40',
				'motion-reduce:transition-none'
			)}
		>
			<div
				className="relative overflow-hidden bg-muted"
				style={{ height: 'clamp(340px, 42vw, 520px)' }}
			>
				{post.cover ? (
					<img
						src={post.cover}
						alt=""
						aria-hidden="true"
						loading="eager"
						className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none"
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
				)}

				<div
					className="absolute inset-0 z-[1] pointer-events-none"
					style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(15,8,4,0.8) 100%)' }}
					aria-hidden="true"
				/>

				<div className="absolute left-0 right-0 bottom-0 z-[3] p-[clamp(20px,2.6vw,32px)]">
					{post.category && (
						<span className="inline-block font-mono text-[10px] tracking-[0.06em] uppercase text-orange-300 rounded-full px-[10px] py-[4px] mb-[12px] opacity-0 translate-y-[8px] transition-[opacity,translate] duration-[450ms] [transition-timing-function:var(--ease-out)] group-hover:opacity-100 group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 motion-reduce:transition-none">
							{post.category}
						</span>
					)}

					<h3 className="m-0 font-clash font-medium text-[clamp(34px,5vw,64px)] leading-[1.02] tracking-[-0.025em] text-white transition-[translate] duration-[500ms] [transition-timing-function:var(--ease-out)] group-hover:-translate-y-[2px] motion-reduce:transition-none">
						{post.title}
					</h3>

					<p className="m-0 mt-[10px] font-mono text-[13px] leading-[1.55] text-white/90 max-w-[540px] overflow-hidden max-h-0 opacity-0 transition-[max-height,opacity] duration-[550ms] [transition-timing-function:var(--ease-out)] group-hover:max-h-[80px] group-hover:opacity-100 [@media(hover:none)]:max-h-[90px] [@media(hover:none)]:opacity-100 motion-reduce:max-h-[90px] motion-reduce:opacity-100">
						{post.description}
					</p>

					<div className="flex items-center gap-[14px] mt-[16px] text-white/75 font-mono text-[12px]">
						<span>{format(new Date(post.date), 'do MMMM yyyy')}</span>
						{post.readingTime && (
							<>
								<span>·</span>
								<span>{post.readingTime} min read</span>
							</>
						)}
					</div>
				</div>
			</div>
		</a>
	);
}

export default function PostsList({ posts }: { posts: BlogPost[] }) {
	const featuredPost = useMemo(() => {
		return posts.find((p) => p.featured) || posts[0];
	}, [posts]);

	const remainingPosts = useMemo(() => {
		return posts.filter((p) => p.slug !== featuredPost?.slug);
	}, [posts, featuredPost]);

	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<div className="mx-auto w-full max-w-[1180px] px-[max(24px,4vw)]">
				<header className="pt-[clamp(100px,14vw,138px)]">
					<ScrollFadeReveal onLoadVisibility>
						<div className="flex items-center gap-[12px] font-mono text-[12px] tracking-[0.06em] uppercase text-[var(--color-orange-primary)] mb-[22px]">
							<span
								className="w-[40px] h-px bg-[var(--color-orange-primary)] opacity-50 shrink-0"
								aria-hidden="true"
							/>
							Journal · {new Date().getFullYear()}
						</div>
						<h1 className="m-0 font-clash font-medium text-[clamp(52px,9.5vw,128px)] leading-[0.9] tracking-[-0.038em] text-foreground">
							Thoughts &amp; Essays
						</h1>
						<div className="flex items-end justify-between gap-[28px] flex-wrap mt-[30px]">
							<p className="m-0 font-clash font-normal text-[clamp(18px,2.4vw,26px)] leading-[1.4] tracking-[-0.01em] max-w-[520px] text-foreground text-pretty">
								Personal musings on full-stack development, design patterns, and the occasional
								philosophical rabbit hole.
							</p>
							<span className="font-mono text-[12px] text-muted-foreground whitespace-nowrap">
								<b className="text-[var(--color-orange-primary)] font-semibold">{posts.length}</b>{' '}
								{posts.length === 1 ? 'post' : 'posts'}
							</span>
						</div>
					</ScrollFadeReveal>
				</header>

				{posts.length > 0 && (
					<ScrollFadeReveal>
						<div className="mt-[clamp(48px,7vw,80px)]">
							{featuredPost && <FeaturedPostCard post={featuredPost} />}

							{remainingPosts.length > 0 && (
								<div className="mt-[clamp(60px,8vw,80px)]">
									<h2 className="m-0 mb-[clamp(28px,4vw,44px)] font-clash font-medium text-[clamp(32px,6vw,56px)] leading-[1.1] tracking-[-0.032em] text-foreground">
										More Stories
									</h2>

									<div className="flex flex-col divide-y divide-border">
										{remainingPosts.map((post, i) => (
											<a
												key={post.slug}
												href={toBlogSlug(post.slug)}
												className={cn(
													'group relative grid grid-cols-[1fr_auto] items-center gap-[26px] px-[14px] py-[30px] text-inherit no-underline',
													'transition-[opacity] duration-[300ms] [transition-timing-function:var(--ease-out)]',
													'hover:text-[var(--color-orange-primary)]',
													'motion-reduce:transition-none',
													'animate-[px-in_0.5s_var(--ease-out)_both]'
												)}
												style={{ animationDelay: `${i * 0.05}s` }}
											>
												<div className="min-w-0">
													<h3 className="m-0 font-clash font-medium text-[clamp(24px,3vw,40px)] leading-[1.1] tracking-[-0.032em] text-foreground group-hover:translate-x-5 transition-[translate] duration-[550ms] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none">
														{post.title}
													</h3>
													<p className="m-0 mt-[8px] font-mono text-[13px] text-muted-foreground group-hover:translate-x-5 transition-[translate] duration-[550ms] delay-[30ms] [transition-timing-function:var(--ease-out)] max-sm:hidden motion-reduce:transition-none">
														{post.description}
													</p>
												</div>

												<div className="flex flex-col items-end gap-[8px] shrink-0 max-sm:flex-col max-sm:items-start">
													<div className="flex items-center gap-[12px] text-[12px] text-muted-foreground whitespace-nowrap">
														<span>{format(new Date(post.date), 'MMM do, yyyy')}</span>
														{post.readingTime && (
															<>
																<span>·</span>
																<span>{post.readingTime} min</span>
															</>
														)}
													</div>
													{post.category && (
														<span className="font-mono text-[10px] tracking-[0.06em] uppercase text-muted-foreground">
															{post.category}
														</span>
													)}
												</div>

												<LuArrowUpRight className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-[translate,color] duration-300 motion-reduce:transition-none absolute right-[14px]" />
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					</ScrollFadeReveal>
				)}

				{posts.length === 0 && (
					<ScrollFadeReveal>
						<p className="font-mono text-[13px] text-muted-foreground py-[70px] px-[14px] text-center">
							No posts yet — check back soon.
						</p>
					</ScrollFadeReveal>
				)}
			</div>
		</ReactLenis>
	);
}
