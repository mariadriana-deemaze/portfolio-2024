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
			const [{ getPost, getNextPost }, { renderMdxToHtml }] = await Promise.all([
				import('@/data/blog'),
				import('@/server/mdx')
			]);
			const post = await getPost(data.slug);
			const [postHtml, nextPost] = await Promise.all([
				post?.body ? renderMdxToHtml(post.body) : undefined,
				post?.date ? getNextPost(post.date, data.slug) : undefined
			]);

			return { post, postHtml, nextPost };
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
			const [{ getProject, getNextProject }, { renderMdxToHtml }] = await Promise.all([
				import('@/data/projects'),
				import('@/server/mdx')
			]);
			const project = await getProject(data.slug);
			const [projectHtml, nextProject] = await Promise.all([
				project?.content ? renderMdxToHtml(project.content) : undefined,
				project ? getNextProject(project.displayOrder, data.slug) : undefined
			]);

			return { project, projectHtml, nextProject };
		} catch (error) {
			console.error('Failed to load project', error);
			return {};
		}
	});
