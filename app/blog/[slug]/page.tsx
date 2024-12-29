import { getPost, getPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { mdxComponents } from '@/components/mdx/components';
import { ArrowLeftIcon, CalendarIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { data } from '@/data/main';
import rehypePrettyCode from 'rehype-pretty-code';

export async function generateMetadata(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;
	const post = await getPost(params.slug);
	return {
		title: `${data.name} | ${data.role} :: ${post?.title}`,
		description: post?.description + ' ' + data.summary,
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

	const { title, description, date, body } = post;

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
			<h1 className="font-clash">{title}</h1>
			<p className="font-mono text-sm text-foreground line-clamp-3">{description}</p>
			<time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500 dark:text-gray-300">
				<CalendarIcon />
				{date}
			</time>
			<hr className="mt-4" />
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
							rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypePrettyCode]
						}
					}}
					components={mdxComponents}
				/>
			</div>
		</article>
	);
}
