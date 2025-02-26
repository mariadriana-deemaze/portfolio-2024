import PostsList from '@/components/pages/blog/posts-list';
import { getPosts } from '@/data/blog';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: Blog`,
	description: "Explore Maria Adriana’s insights on Full Stack Development, with in-depth articles on problem-solving strategies, architecture decisions, performance optimization, and modern web technologies.",
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
