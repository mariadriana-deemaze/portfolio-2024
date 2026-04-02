import { createFileRoute } from '@tanstack/react-router';

import PostsList from '@/components/pages/blog/posts-list';
import { SeoMetadata } from '@/data/routes/blog/index';
import { createSeoHead } from '@/lib/head';
import { getPostsFn } from '@/server-fns/content';

export const Route = createFileRoute('/blog/')({
	loader: async () => {
		const posts = await getPostsFn();

		return {
			posts
		};
	},
	head: () => createSeoHead(SeoMetadata()),
	component: BlogIndexRoute
});

function BlogIndexRoute() {
	const { posts } = Route.useLoaderData();

	return <PostsList posts={posts} />;
}
