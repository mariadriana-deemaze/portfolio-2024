import PostsList from '@/components/pages/blog/posts-list';
import { getPosts } from '@/data/blog';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.about}`,
	description: data.summary
};

export async function generateStaticParams() {
	const posts = await getPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page() {
	const posts = await getPosts();
	return <PostsList posts={posts} />;
}
