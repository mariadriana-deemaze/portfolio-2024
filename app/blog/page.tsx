import PostsList from '@/components/pages/blog/posts-list';
import { getPosts } from '@/data/blog';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: Blog`,
	description: 'My personal blog, for rambles and so on → ' + data.summary,
	alternates: {
		canonical: 'https://maria-adriana.com/blog'
	}
};

export async function generateStaticParams() {
	const posts = await getPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page() {
	const posts = await getPosts();
	return <PostsList posts={posts} />;
}
