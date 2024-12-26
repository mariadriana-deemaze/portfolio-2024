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
import { CalendarIcon } from '@radix-ui/react-icons';

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
				className={`${clashDisplay.className}`}
			>
				{title}
			</h1>
			<h2 className={`${clashDisplay.className}`}>{description}</h2>
			<span className="flex flex-row gap-2 items-center text-pretty font-mono text-sm text-foreground text-gray-500">
				<CalendarIcon />
				{date}
			</span>
			<hr className='mt-4' />
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
							rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
						}
					}}
					components={mdxComponents}
				/>
			</div>
		</div>
	);
}
