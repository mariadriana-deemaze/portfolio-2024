import { fetchSanityQuery } from '@/lib/sanity';

const WORDS_PER_MINUTE = 200;

function calculateReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export interface BlogPost {
	title: string;
	description: string;
	date: string;
	slug: string;
	body: string;
	external_link: string;
	keywords: string[];
	cover?: string;
	category?: string;
	featured?: boolean;
	readingTime?: number;
	views?: number;
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
	cover?: string;
	category?: string;
	featured?: boolean;
	views?: number;
};

const POST_FIELDS = `
  title,
  description,
  date,
  "slug": slug.current,
  body,
  link,
  keywords,
  published,
  "cover": cover.asset->url,
  category,
  featured,
  views
`;

function normalizePost(post: SanityBlogPost): BlogPost {
	const body = post.body ?? '';
	return {
		title: post.title,
		description: post.description,
		date: post.date,
		slug: post.slug,
		body,
		external_link: post.link ?? '',
		keywords: Array.isArray(post.keywords) ? post.keywords.map((w) => `#${w}`) : [],
		cover: post.cover,
		category: post.category,
		featured: post.featured ?? false,
		readingTime: body ? calculateReadingTime(body) : undefined,
		views: post.views
	};
}

export const getPosts = async () => {
	const posts = await fetchSanityQuery<SanityBlogPost[]>(
		`*[_type == "post" && published != false] | order(date desc) { ${POST_FIELDS} }`
	);

	return posts.map(normalizePost);
};

export async function getPost(slug: string) {
	const post = await fetchSanityQuery<SanityBlogPost | null>(
		`*[_type == "post" && slug.current == $slug][0]{ ${POST_FIELDS} }`,
		{ slug }
	);

	return post ? normalizePost(post) : undefined;
}

export async function getPostViews(slug: string) {
	const result = await fetchSanityQuery<{ _id: string; views: number } | null>(
		`*[_type == "post" && slug.current == $slug][0]{ _id, views }`,
		{ slug }
	);
	return result;
}

export async function getNextPost(date: string, slug: string) {
	const next = await fetchSanityQuery<SanityBlogPost | null>(
		`*[_type == "post" && published != false && date < $date && slug.current != $slug] | order(date desc)[0]{ title, "slug": slug.current }`,
		{ date, slug }
	);

	if (next) return { title: next.title, slug: next.slug };

	const newest = await fetchSanityQuery<SanityBlogPost | null>(
		`*[_type == "post" && published != false && slug.current != $slug] | order(date desc)[0]{ title, "slug": slug.current }`,
		{ slug }
	);

	return newest ? { title: newest.title, slug: newest.slug } : undefined;
}
