'use server';

import fs from 'node:fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = './data/blog';

export interface BlogPost {
	title: string;
	description: string;
	date: string;
	slug: string;
	body: string;
	type: string;
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
				const postContent = await fs.readFile(filePath, 'utf8');
				const { data, content } = matter(postContent);

				if (data.published === false) {
					return null;
				}

				return {
					...data,
					keywords: data.keywords.split(',').map((word: string) => `#${word}`),
					external_link: data.link,
					body: content,
					type: 'post'
				} as BlogPost;
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
