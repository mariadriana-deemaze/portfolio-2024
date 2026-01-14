
import { getSanityClient } from '@/lib/sanity';

export interface BlogPost {
	title: string;
	description: string;
	date: string;
	slug: string;
	body: string;
	external_link: string;
	keywords: string[];
}

type SanityBlogPost = {
	title: string;
	description: string;
	date: string;
	slug: string;
	body?: string;
	link?: string;
	keywords?: string[];
	published?: boolean;
};

const POST_FIELDS = `
  title,
  description,
  date,
  "slug": slug.current,
  body,
  link,
  keywords,
  published
`;

function normalizePost(post: SanityBlogPost): BlogPost {
	return {
		title: post.title,
		description: post.description,
		date: post.date,
		slug: post.slug,
		body: post.body ?? '',
		external_link: post.link ?? '',
		keywords: Array.isArray(post?.keywords) ? post.keywords.map((w) => `#${w}`) : [],
	};
}

export const getPosts = async () => {
	const posts = await getSanityClient().fetch<SanityBlogPost[]>(
		`*[_type == "post" && published != false] | order(date desc) { ${POST_FIELDS} }`
	);
	return posts.map(normalizePost);
};

export async function getPost(slug: string) {
	const post = await getSanityClient().fetch<SanityBlogPost | null>(
		`*[_type == "post" && slug.current == $slug][0]{ ${POST_FIELDS} }`,
		{ slug }
	);
	return post ? normalizePost(post) : undefined;
}

