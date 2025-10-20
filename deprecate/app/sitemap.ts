import { getPosts } from '@/data/blog';
import { getProjects } from '@/data/projects';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const postsLinks = await getPosts().then((posts) => {
		return posts.map((post) => {
			return {
				url: `/blog/${post.slug}`
			};
		});
	});

	const projectsLinks = await getProjects().then((projects) => {
		return projects.map((project) => {
			return {
				url: `/projects/${project.slug}`
			};
		});
	});

	const links: MetadataRoute.Sitemap = [
		{
			url: '/'
		},
		{
			url: '/blog'
		},
		{
			url: '/contact'
		},
		...postsLinks,
		...projectsLinks
	];

	return links.map((l) => {
		return { url: 'https://www.maria-adriana.com' + l.url };
	});
}
