import { getPost } from '@/data/blog';
import { mutateInSanity } from '@/server/sanity';

const VIEWS_COOKIE_NAME = 'blog_views_tracking';
const VIEWS_COOKIE_MAX_AGE = 86400;

function setViewsCookie(response: Response, slug: string): void {
	const cookieValue = `${slug}=${Date.now()}`;
	response.headers.append(
		'Set-Cookie',
		`${VIEWS_COOKIE_NAME}=${cookieValue}; Max-Age=${VIEWS_COOKIE_MAX_AGE}; Path=/api/blog/${slug}/views; HttpOnly; SameSite=Lax`
	);
}

function hasViewedPost(request: Request, slug: string): boolean {
	const cookies = request.headers.get('cookie') || '';
	return cookies.includes(`${slug}=`);
}

export async function handleViewsPost(request: Request): Promise<Response> {
	try {
		const url = new URL(request.url);
		const slug = url.pathname.split('/').filter(Boolean).pop();

		if (!slug) {
			return new Response(JSON.stringify({ error: 'Invalid slug' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const post = await getPost(slug);
		if (!post) {
			return new Response(JSON.stringify({ error: 'Post not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const alreadyCounted = hasViewedPost(request, slug);

		if (!alreadyCounted) {
			const mutation = {
				patch: {
					query: `*[_type == "post" && slug.current == "${slug}"][0]`,
					inc: { views: 1 }
				}
			};

			try {
				await mutateInSanity([mutation]);
			} catch (error) {
				console.error(`Failed to increment views for post ${slug}:`, error);
				const response = new Response(
					JSON.stringify({
						error: 'Failed to record view',
						views: 0,
						counted: false
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json' }
					}
				);
				setViewsCookie(response, slug);
				return response;
			}
		}

		const response = new Response(
			JSON.stringify({
				views: post.views ?? 0,
				counted: !alreadyCounted
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (!alreadyCounted) {
			setViewsCookie(response, slug);
		}

		return response;
	} catch (error) {
		console.error('Views endpoint error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
