import { getPosts } from '@/data/blog';
import { BASE_URL } from '@/data/main';
import { getProjects } from '@/data/projects';
import { ROUTES, STATIC_ROUTES, toBlogSlug, toProjectsSlug } from '@/utils/routes';

export type CommandLink = {
	url: string;
	title: string;
	type: 'internal' | 'blog' | 'projects' | 'social';
};

async function getSafePosts() {
	try {
		return await getPosts();
	} catch (error) {
		console.error('Failed to load posts', error);
		return [];
	}
}

async function getSafeProjects() {
	try {
		return await getProjects();
	} catch (error) {
		console.error('Failed to load projects', error);
		return [];
	}
}

export async function generateCommandLinks(): Promise<CommandLink[]> {
	const [posts, projects] = await Promise.all([getSafePosts(), getSafeProjects()]);

	const internal = [
		{ url: ROUTES.blog, title: 'Blog', type: 'internal' as const },
		{ url: ROUTES.contact, title: 'Contact', type: 'internal' as const }
	];
	const postLinks = posts.map((post) => ({
		url: toBlogSlug(post.slug),
		title: post.title,
		type: 'blog' as const
	}));
	const projectLinks = projects.map((project) => ({
		url: toProjectsSlug(project.slug),
		title: project.title,
		type: 'projects' as const
	}));

	return [...internal, ...postLinks, ...projectLinks];
}

function sitemapEntry(loc: string, lastmod?: string): string {
	return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod.split('T')[0]}</lastmod>` : ''}\n  </url>`;
}

export async function generateSitemapXml(): Promise<string> {
	const [posts, projects] = await Promise.all([getSafePosts(), getSafeProjects()]);

	const xmlNodes = [
		...STATIC_ROUTES.map((route) => sitemapEntry(`${BASE_URL}${route}`)),
		...posts.map((post) => sitemapEntry(`${BASE_URL}${toBlogSlug(post.slug)}`, post.date)),
		...projects.map((project) => sitemapEntry(`${BASE_URL}${toProjectsSlug(project.slug)}`))
	].join('\n');

	return (
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		`${xmlNodes}\n` +
		`</urlset>`
	);
}
