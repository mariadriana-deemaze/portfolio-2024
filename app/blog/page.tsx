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
	//const posts = await getPosts();

	// TODO: Simulation purposes
	const posts = new Array(20).fill({
		title: 'Hello world',
		description: 'First Post',
		date: 'Dec 12, 2024',
		slug: 'hello-world',
		body:
			'\r\n' +
			'\r\n' +
			'## My first blog post via MDX parsing. Still figuring it out.\r\n' +
			'\r\n' +
			'<Image src="/blog/image.png" alt="Random image is random" width={600} height={400} />\r\n' +
			'\r\n' +
			"## Here's a list\r\n" +
			' - Point one\r\n' +
			' - Point two\r\n' +
			'\r\n' +
			'## Ahh look, a code snippet\r\n' +
			'\r\n' +
			'```ts \r\n' +
			'const user: User = await UserFactory.create()\r\n' +
			'```',
		type: 'post'
	});

	console.log('posts ->', posts);
	return (
		<div className="flex flex-col justify-center items-center">
			<PostsList posts={posts} />
		</div>
	);
}
