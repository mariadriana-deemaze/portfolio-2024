import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const slugSchema = z.object({
	slug: z.string().min(1)
});

export const getCommandLinksFn = createServerFn({ method: 'GET' }).handler(async () => {
	const { generateCommandLinks } = await import('@/server/site-data');

	return generateCommandLinks();
});

export const getPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const { getPosts } = await import('@/data/blog');
		return await getPosts();
	} catch (error) {
		console.error('Failed to load posts', error);
		return [];
	}
});

export const getPostFn = createServerFn({ method: 'GET' })
	.inputValidator(slugSchema)
	.handler(async ({ data }) => {
		try {
			const [{ getPost, getNextPost }, { highlightCodeBlocks }] = await Promise.all([
				import('@/data/blog'),
				import('@/server/highlight')
			]);
			const post = await getPost(data.slug);
			const [nextPost, highlightedBody] = await Promise.all([
				post?.date ? getNextPost(post.date, data.slug) : undefined,
				post?.structuredBody ? highlightCodeBlocks(post.structuredBody) : undefined
			]);
			const processedPost =
				post && highlightedBody ? { ...post, structuredBody: highlightedBody } : post;

			return { post: processedPost, nextPost };
		} catch (error) {
			console.error('Failed to load blog post', error);
			return {};
		}
	});

export const getProjectsFn = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const { getProjects } = await import('@/data/projects');
		return await getProjects();
	} catch (error) {
		console.error('Failed to load projects', error);
		return [];
	}
});

export const getProjectFn = createServerFn({ method: 'GET' })
	.inputValidator(slugSchema)
	.handler(async ({ data }) => {
		try {
			const [{ getProject, getNextProject }, { highlightCodeBlocks }] = await Promise.all([
				import('@/data/projects'),
				import('@/server/highlight')
			]);
			const project = await getProject(data.slug);
			const [nextProject, highlightedBody] = await Promise.all([
				project ? getNextProject(project.displayOrder, data.slug) : undefined,
				project?.structuredBody ? highlightCodeBlocks(project.structuredBody) : undefined
			]);
			const processedProject =
				project && highlightedBody ? { ...project, structuredBody: highlightedBody } : project;

			return { project: processedProject, nextProject };
		} catch (error) {
			console.error('Failed to load project', error);
			return {};
		}
	});
