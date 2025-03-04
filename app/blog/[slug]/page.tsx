import { getPost, getPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { mdxComponents } from '@/components/mdx/components';
import { ArrowLeftIcon, ArrowTopRightIcon, CalendarIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { data } from '@/data/main';
import rehypePrettyCode from 'rehype-pretty-code';
import '@/styles/blog/index.css';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;
	const post = await getPost(params.slug);
	return {
		title: `${data.name} | ${data.role} :: ${post?.title}`,
		description: `${data.name} | ${data.role} based in Portugal :: ${post?.description}.`,
		alternates: {
			canonical: `https://maria-adriana.com/blog/${post?.slug}`
		}
	};
}

export async function generateStaticParams() {
	const posts = await getPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;

	const post = await getPost(params.slug);

	if (!post) {
		return notFound();
	}

	const { title, date, body, keywords } = post;

	return (
		<article className="flex flex-col gap-2 blog-page">
			<Link
				href="/blog"
				className="flex flex-row gap-2 font-mono text-sm text-gray-500 dark:text-white/60 mb-8 items-center hover:underline hover:text-orange-500 hover:opacity-75 duration-200"
			>
				<span className="flex border border-gray-300 dark:border-white/20 bg-card rounded-full h-7 w-7 items-center justify-center">
					<ArrowLeftIcon className="text-gray-500 dark:text-white/80" />
				</span>
				Go back
			</Link>
			<h1>{title}</h1>
			<time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500 dark:text-gray-300">
				<CalendarIcon />
				{format(new Date(date), 'do MMMM yyyy')}
			</time>

			<hr className="mt-4" />

			<section className="flex gap-1 flex-row justify-between">
				<div className="mt-6 flex flex-wrap gap-1">
					{keywords.map((keyword) => {
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

				<div className="mt-6 flex flex-wrap gap-1 ">
					<Badge
						className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default"
						variant="outline"
					>
						<Link
							className="flex flex-row gap-2"
							href={post.external_link}
							target="_blank"
						>
							<ArrowTopRightIcon /> On Medium
						</Link>
					</Badge>
				</div>
			</section>

			<div className="content">
				<MDXRemote
					source={body}
					options={{
						mdxOptions: {
							remarkPlugins: [
								remarkGfm,
								remarkFrontmatter,
								[
									remarkToc,
									{
										tight: true,
										maxDepth: 5
									}
								]
							],
							rehypePlugins: [
								rehypeSlug,
								rehypeAutolinkHeadings,
								() =>
									rehypePrettyCode({
										theme: 'github-dark-high-contrast'
									})
							]
						}
					}}
					components={mdxComponents}
				/>
			</div>
		</article>
	);
}
