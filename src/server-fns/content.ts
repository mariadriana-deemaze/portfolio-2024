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
			const [{ getPost }, { renderMdxToHtml }] = await Promise.all([
				import('@/data/blog'),
				import('@/server/mdx')
			]);
			const post = await getPost(data.slug);
			const postHtml = post?.body ? await renderMdxToHtml(post.body) : undefined;

			return { post, postHtml };
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
			const [{ getProject }, { renderMdxToHtml }] = await Promise.all([
				import('@/data/projects'),
				import('@/server/mdx')
			]);
			const project = await getProject(data.slug);
			const projectHtml = project?.content ? await renderMdxToHtml(project.content) : undefined;

			return { project, projectHtml };
		} catch (error) {
			console.error('Failed to load project', error);
			return {};
		}
	});
