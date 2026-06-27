import { getPostViews } from '@/data/blog';
import { mutateInSanity } from '@/server/sanity';

const COOKIE_NAME = 'blog_viewed';
const COOKIE_MAX_AGE = 86400;
const MAX_TRACKED_SLUGS = 50;

function getViewedSlugs(request: Request): Set<string> {
	const cookies = request.headers.get('cookie') || '';
	const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]*)`));
	if (!match) return new Set();
	return new Set(decodeURIComponent(match[1]).split(',').filter(Boolean));
}

function setViewedCookie(response: Response, slugs: Set<string>): void {
	const trimmed = [...slugs].slice(-MAX_TRACKED_SLUGS);
	const value = encodeURIComponent(trimmed.join(','));
	response.headers.append(
		'Set-Cookie',
		`${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax`
	);
}

export async function handleViewsPost(request: Request): Promise<Response> {
	try {
		const url = new URL(request.url);
		const segments = url.pathname.split('/').filter(Boolean);
		const slugIndex = segments.indexOf('blog') + 1;
		const slug = segments[slugIndex];

		if (!slug || !/^[\w-]+$/.test(slug)) {
			return Response.json({ error: 'Invalid slug' }, { status: 400 });
		}

		const post = await getPostViews(slug);
		if (!post) {
			return Response.json({ error: 'Post not found' }, { status: 404 });
		}

		const viewed = getViewedSlugs(request);
		const alreadyCounted = viewed.has(slug);
		let currentViews = post.views;

		if (!alreadyCounted) {
			try {
				if (post.metricId) {
					await mutateInSanity([
						{
							patch: {
								id: post.metricId,
								inc: { views: 1 }
							}
						}
					]);
				} else {
					await mutateInSanity([
						{
							create: {
								_type: 'postMetric',
								post: { _type: 'reference', _ref: post.postId },
								views: 1
							}
						}
					]);
				}
				currentViews += 1;
				viewed.add(slug);
			} catch (error) {
				console.error(`Failed to increment views for "${slug}":`, error);
				return Response.json({ views: currentViews, counted: false }, { status: 200 });
			}
		}

		const response = Response.json(
			{ views: currentViews, counted: !alreadyCounted },
			{ status: 200 }
		);
		if (!alreadyCounted) {
			setViewedCookie(response, viewed);
		}
		return response;
	} catch (error) {
		console.error('Views endpoint error:', error);
		return Response.json({ error: 'Unprocessable entity' }, { status: 422 });
	}
}
