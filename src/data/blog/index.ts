
import fs from 'node:fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = './src/data/blog';

export interface BlogPostRaw {
	id: string;
	slug: string;
	link: string;
	title: string;
	description: string;
	date: string;
	keywords: string[];
	published: boolean;
}

export interface BlogPost {
	title: string;
	description: string;
	date: string;
	slug: string;
	body: string;
	external_link: string;
	keywords: string[];
}

export const getPosts = async () => {
	const content = await fs.readdir(BLOG_DIR);

	const posts = await Promise.all(
		content
			.filter((file) => path.extname(file) === '.md')
			.map(async (file) => {
				const filePath = `${BLOG_DIR}/${file}`;
				const raw = await fs.readFile(filePath, 'utf8');

				const { data, content } = matter(raw) as unknown as { data: BlogPostRaw; content: string };

				if (data.published === false) return null;

				const post: BlogPost = {
					...data,
					keywords: Array.isArray(data?.keywords) ? (data.keywords).map((w) => `#${w}`) : [],
					external_link: data?.link,
					body: content,
				};
				return post;
			})
	);

	return posts
		.filter((post) => post !== null)
		.sort((a, b) =>
			a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0
		) as BlogPost[];
};

export async function getPost(slug: string) {
	const posts = await getPosts();
	return posts.find((post) => post.slug === slug);
}

