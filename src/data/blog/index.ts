import { fetchSanityQuery } from '@/lib/sanity';
import type {
	PortableTextBody,
	ResolvedAuthor,
	ResolvedImage,
	ResolvedSeo
} from '@/lib/sanity-types';
import {
	AUTHOR_PROJECTION,
	LOCALIZED_RICH_IMAGE_PROJECTION,
	localizedBody,
	localizedField
} from '@/lib/sanity-types';

// ── Helpers ───────────────────────────────────────────────────────────

const WORDS_PER_MINUTE = 200;

function calculateReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// ── GROQ projections ──────────────────────────────────────────────────

const POST_FIELDS = `
  "title": ${localizedField('title')},
  "description": ${localizedField('description')},
  date,
  "slug": slug.current,
  published,
  featured,
  category,
  "tags": tags,
  "coverImage": coverImage ${LOCALIZED_RICH_IMAGE_PROJECTION},
  "author": author ${AUTHOR_PROJECTION},
  canonicalUrl,
  "structuredBody": ${localizedBody('structuredBody')},
  "seo": seo { "title": ${localizedField('title')}, "description": ${localizedField('description')}, "ogImage": ogImage.asset->url },
  // Legacy fields — still projected until migration completes
  body,
  link,
  keywords,
  "cover": cover.asset->url
`;

const NEXT_POST_FIELDS = `"title": ${localizedField('title')}, "slug": slug.current`;

// ── Sanity response types ─────────────────────────────────────────────

type SanityBlogPost = {
	title: string;
	description: string;
	date: string;
	slug: string;
	published?: boolean;
	featured?: boolean;
	category?: string;
	tags?: string[];
	coverImage?: ResolvedImage;
	author?: ResolvedAuthor;
	canonicalUrl?: string;
	structuredBody?: PortableTextBody;
	seo?: ResolvedSeo;
	// Legacy
	body?: string;
	link?: string;
	keywords?: string[];
	cover?: string;
};

// ── Application model ─────────────────────────────────────────────────

export interface BlogPost {
	title: string;
	description: string;
	date: string;
	slug: string;
	featured: boolean;
	category?: string;
	tags: string[];
	coverImage?: ResolvedImage;
	author?: ResolvedAuthor;
	canonicalUrl?: string;
	structuredBody?: PortableTextBody;
	seo?: ResolvedSeo;
	readingTime?: number;
	// Legacy — available until migration completes
	body: string;
	external_link: string;
	keywords: string[];
	cover?: string;
}

// ── Normalizer ────────────────────────────────────────────────────────

function normalizePost(post: SanityBlogPost): BlogPost {
	const body = post.body ?? '';
	return {
		title: post.title,
		description: post.description,
		date: post.date,
		slug: post.slug,
		featured: post.featured ?? false,
		category: post.category,
		tags: Array.isArray(post.tags) ? post.tags : [],
		coverImage: post.coverImage,
		author: post.author,
		canonicalUrl: post.canonicalUrl,
		structuredBody: post.structuredBody,
		seo: post.seo,
		readingTime: body ? calculateReadingTime(body) : undefined,
		// Legacy
		body,
		external_link: post.link ?? '',
		keywords: Array.isArray(post.keywords) ? post.keywords.map((w) => `#${w}`) : [],
		cover: post.coverImage?.url ?? post.cover
	};
}

// ── Queries ───────────────────────────────────────────────────────────

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
	const result = await fetchSanityQuery<{
		postId: string;
		metricId: string | null;
		views: number;
	} | null>(
		`*[_type == "post" && slug.current == $slug][0]{
      "postId": _id,
      "metricId": *[_type == "postMetric" && references(^._id)][0]._id,
      "views": coalesce(*[_type == "postMetric" && references(^._id)][0].views, 0)
    }`,
		{ slug }
	);
	return result;
}

export async function getNextPost(date: string, slug: string) {
	const next = await fetchSanityQuery<SanityBlogPost | null>(
		`*[_type == "post" && published != false && date < $date && slug.current != $slug] | order(date desc)[0]{ ${NEXT_POST_FIELDS} }`,
		{ date, slug }
	);

	if (next) return { title: next.title, slug: next.slug };

	const newest = await fetchSanityQuery<SanityBlogPost | null>(
		`*[_type == "post" && published != false && slug.current != $slug] | order(date desc)[0]{ ${NEXT_POST_FIELDS} }`,
		{ slug }
	);

	return newest ? { title: newest.title, slug: newest.slug } : undefined;
}
