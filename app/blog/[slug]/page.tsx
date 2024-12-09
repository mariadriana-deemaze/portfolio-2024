import { clashDisplay } from '@/app/layout';
import { getPost, getPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { mdxComponents } from '@/components/mdx/components';

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

	console.log('post ->', post);

	return (
		<div className="flex flex-col gap-2 blog-page">
			<h1
				className={`${clashDisplay.className} relative text-[40px] md:text-[50px] whitespace-nowrap max-w-min font-medium leading-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-transparent dark:via-gray-100 via-slate-800 dark:to-white to-slate-800 bg-clip-text text-transparent`}
			>
				{title}
			</h1>
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>{description}</h2>
			<span className="text-pretty font-mono text-sm text-foreground text-gray-400">
				{date}
			</span>
			<hr />
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
						rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
					}
				}}
				components={mdxComponents}
			/>
		</div>
	);
}
