import { getPost, getPosts } from '@/data/blog';
import { BASE_URL, data } from '@/data/main';
import { getProject, getProjects } from '@/data/projects';

const MARKDOWN_PATHS = new Set(['/', '/blog', '/projects', '/contact']);

export const AGENT_DISCOVERY_LINKS = [
	'</.well-known/api-catalog>; rel="api-catalog"',
	'</api/openapi.json>; rel="service-desc"; type="application/openapi+json"',
	'</docs/api>; rel="service-doc"; type="text/markdown"',
	'</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"'
] as const;

type ApiCatalogDocument = {
	linkset: Array<Record<string, unknown>>;
};

type OpenApiDocument = {
	openapi: string;
	info: {
		title: string;
		version: string;
		description: string;
	};
	servers: Array<{
		url: string;
	}>;
	paths: Record<string, unknown>;
};

type ApiCatalogEntry = {
	anchor: string;
	'service-desc': Array<{
		href: string;
		type: string;
	}>;
	'service-doc': Array<{
		href: string;
		type: string;
	}>;
	status: Array<{
		href: string;
		type: string;
	}>;
};

function normalizePathname(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith('/')) {
		return pathname.slice(0, -1);
	}

	return pathname;
}

function toAbsoluteUrl(pathname: string): string {
	return new URL(pathname, BASE_URL).toString();
}

function isDynamicContentPath(pathname: string, prefix: string): boolean {
	return pathname.startsWith(`${prefix}/`) && pathname.split('/').length === 3;
}

function markdownTokens(markdown: string): string {
	const words = markdown.split(/\s+/).filter(Boolean).length;
	return String(Math.max(1, Math.ceil(words * 1.3)));
}

function markdownFrontmatter(title: string, pathname: string, description?: string): string {
	const lines = ['---', `title: ${title}`, `url: ${toAbsoluteUrl(pathname)}`];

	if (description) {
		lines.push(`description: ${description.replace(/\r?\n/g, ' ')}`);
	}

	lines.push('---', '');

	return lines.join('\n');
}

function markdownList(items: string[], emptyText: string): string {
	return items.length > 0 ? items.join('\n') : emptyText;
}

function createApiCatalogEntry(anchorPath: string): ApiCatalogEntry {
	return {
		anchor: toAbsoluteUrl(anchorPath),
		'service-desc': [
			{
				href: toAbsoluteUrl('/api/openapi.json'),
				type: 'application/openapi+json'
			}
		],
		'service-doc': [
			{
				href: toAbsoluteUrl('/docs/api'),
				type: 'text/markdown'
			}
		],
		status: [
			{
				href: toAbsoluteUrl('/api/health'),
				type: 'application/json'
			}
		]
	};
}

async function getSafePosts() {
	try {
		return await getPosts();
	} catch (error) {
		console.error('Failed to load posts for markdown response.', error);
		return [];
	}
}

async function getSafeProjects() {
	try {
		return await getProjects();
	} catch (error) {
		console.error('Failed to load projects for markdown response.', error);
		return [];
	}
}

export function isMarkdownPath(pathname: string): boolean {
	const normalizedPath = normalizePathname(pathname);

	return (
		MARKDOWN_PATHS.has(normalizedPath) ||
		isDynamicContentPath(normalizedPath, '/blog') ||
		isDynamicContentPath(normalizedPath, '/projects')
	);
}

export function requestWantsMarkdown(acceptHeader?: string | null): boolean {
	if (!acceptHeader) {
		return false;
	}

	return acceptHeader
		.split(',')
		.map((part) => part.trim().toLowerCase())
		.some((part) => part.startsWith('text/markdown'));
}

export function createMarkdownResponse(markdown: string): Response {
	return new Response(markdown, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
			'x-markdown-tokens': markdownTokens(markdown)
		}
	});
}

export async function getMarkdownDocument(pathname: string): Promise<string | undefined> {
	const normalizedPath = normalizePathname(pathname);

	switch (normalizedPath) {
		case '/': {
			const projects = await getSafeProjects();
			const featuredProjects = projects
				.slice(0, 5)
				.map(
					(project) =>
						`- [${project.title}](${toAbsoluteUrl(`/projects/${project.slug}`)}): ${project.description}`
				);
			const socialLinks = data.contact.social.map((social) => `- [${social.name}](${social.url})`);

			return [
				markdownFrontmatter(
					`${data.name} | ${data.role}`,
					'/',
					`${data.role} portfolio, projects, blog posts, and contact details.`
				),
				`# ${data.name}`,
				'',
				`**Role:** ${data.role}`,
				'',
				`**Location:** ${data.location}`,
				'',
				data.about,
				'',
				'## Summary',
				'',
				data.summary,
				'',
				'## Featured routes',
				'',
				`- [Projects](${toAbsoluteUrl('/projects')})`,
				`- [Blog](${toAbsoluteUrl('/blog')})`,
				`- [Contact](${toAbsoluteUrl('/contact')})`,
				'',
				'## Featured projects',
				'',
				markdownList(featuredProjects, '- No featured projects available.'),
				'',
				'## Contact',
				'',
				`- Email: ${data.contact.email}`,
				markdownList(socialLinks, '- No social profiles available.')
			].join('\n');
		}

		case '/blog': {
			const posts = await getSafePosts();
			const items = posts.map(
				(post) =>
					`- [${post.title}](${toAbsoluteUrl(`/blog/${post.slug}`)}) (${post.date}): ${post.description}`
			);

			return [
				markdownFrontmatter(`${data.name} | Blog`, '/blog', `Published writing by ${data.name}.`),
				'# Blog',
				'',
				markdownList(items, '- No published posts available.')
			].join('\n');
		}

		case '/projects': {
			const projects = await getSafeProjects();
			const items = projects.map(
				(project) =>
					`- [${project.title}](${toAbsoluteUrl(`/projects/${project.slug}`)}) (${project.year}): ${project.description}`
			);

			return [
				markdownFrontmatter(
					`${data.name} | Projects`,
					'/projects',
					`Project portfolio for ${data.name}.`
				),
				'# Projects',
				'',
				markdownList(items, '- No published projects available.')
			].join('\n');
		}

		case '/contact': {
			const socialLinks = data.contact.social.map((social) => `- [${social.name}](${social.url})`);

			return [
				markdownFrontmatter(
					`${data.name} | Contact`,
					'/contact',
					`Contact details and submission options for ${data.name}.`
				),
				'# Contact',
				'',
				`Email: ${data.contact.email}`,
				'',
				'## Response window',
				'',
				'Typical response time is within 1 business day.',
				'',
				'## Social profiles',
				'',
				markdownList(socialLinks, '- No social profiles available.'),
				'',
				'## Contact API',
				'',
				`POST ${toAbsoluteUrl('/api/send')}`,
				'',
				'JSON body fields: `name`, `email`, `subject`, `message`.'
			].join('\n');
		}
	}

	if (isDynamicContentPath(normalizedPath, '/blog')) {
		const slug = normalizedPath.slice('/blog/'.length);
		const post = await getPost(slug);
		if (!post) return undefined;

		return [
			markdownFrontmatter(post.title, normalizedPath, post.description),
			`# ${post.title}`,
			'',
			`- Published: ${post.date}`,
			post.external_link ? `- Canonical source: ${post.external_link}` : undefined,
			post.keywords.length > 0 ? `- Keywords: ${post.keywords.join(', ')}` : undefined,
			'',
			post.body
		]
			.filter((part): part is string => Boolean(part))
			.join('\n');
	}

	if (isDynamicContentPath(normalizedPath, '/projects')) {
		const slug = normalizedPath.slice('/projects/'.length);
		const project = await getProject(slug);

		if (!project) {
			return undefined;
		}

		return [
			markdownFrontmatter(project.title, normalizedPath, project.description),
			`# ${project.title}`,
			'',
			`- Year: ${project.year}`,
			project.liveUrl ? `- Live URL: ${project.liveUrl}` : undefined,
			project.repo
				? `- Repository: https://github.com/mariadriana-deemaze/${project.repo}`
				: undefined,
			project.technologies.length > 0
				? `- Technologies: ${project.technologies.map((technology) => technology.label).join(', ')}`
				: undefined,
			'',
			project.content
		]
			.filter((part): part is string => Boolean(part))
			.join('\n');
	}

	return undefined;
}

export function createApiCatalogDocument(): ApiCatalogDocument {
	return {
		linkset: [
			createApiCatalogEntry('/api/send'),
			createApiCatalogEntry('/api/spotify/currently-playing')
		]
	};
}

export function createOpenApiDocument(): OpenApiDocument {
	return {
		openapi: '3.1.0',
		info: {
			title: `${data.name} API`,
			version: '1.0.0',
			description:
				'Public machine-readable API documentation for the portfolio contact form and Spotify now-playing endpoints.'
		},
		servers: [{ url: BASE_URL }],
		paths: {
			'/api/health': {
				get: {
					summary: 'Health check',
					responses: {
						'200': {
							description: 'Service health summary.'
						}
					}
				}
			},
			'/api/send': {
				post: {
					summary: 'Submit a contact request',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									type: 'object',
									required: ['name', 'email', 'subject', 'message'],
									properties: {
										name: { type: 'string' },
										email: { type: 'string', format: 'email' },
										subject: { type: 'string' },
										message: { type: 'string' }
									}
								}
							}
						}
					},
					responses: {
						'200': {
							description: 'Message accepted for delivery.'
						},
						'400': {
							description: 'Validation failed.'
						},
						'429': {
							description: 'Rate limited.'
						},
						'500': {
							description: 'Email delivery failed.'
						}
					}
				}
			},
			'/api/spotify/currently-playing': {
				get: {
					summary: 'Read the current Spotify playback state',
					responses: {
						'200': {
							description: 'Playback state payload.'
						},
						'404': {
							description: 'Playback state unavailable.'
						}
					}
				}
			}
		}
	};
}

export function createApiDocsMarkdown(): string {
	return [
		markdownFrontmatter(
			`${data.name} API docs`,
			'/docs/api',
			'Machine-readable service documentation for public portfolio APIs.'
		),
		'# API documentation',
		'',
		'## Base URL',
		'',
		BASE_URL,
		'',
		'## Endpoints',
		'',
		'### `GET /api/health`',
		'Returns a small health payload for automated checks.',
		'',
		'### `POST /api/send`',
		'Submits the portfolio contact form.',
		'',
		'Request body:',
		'',
		'```json',
		'{',
		'  "name": "Jane Doe",',
		'  "email": "jane@example.com",',
		'  "subject": "Project inquiry",',
		'  "message": "I would like to discuss a collaboration."',
		'}',
		'```',
		'',
		'### `GET /api/spotify/currently-playing`',
		'Returns the latest Spotify now-playing snapshot when available.',
		'',
		'## Discovery',
		'',
		`- API catalog: ${toAbsoluteUrl('/.well-known/api-catalog')}`,
		`- OpenAPI: ${toAbsoluteUrl('/api/openapi.json')}`
	].join('\n');
}
