import express, { type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import http from 'node:http';
import type { Seo } from './server/types';
import { matchRoute } from './server/routes';
import apiRouter from './server/routes/api';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const USE_HMR =
	process.argv.includes('--hmr') ||
	process.env.SSR_HMR === '1' ||
	process.env.NODE_ENV === 'development';

function serializeProps(props: object): string {
	return JSON.stringify(props)
		.replace(/</g, '\\u003c')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

function escapeHtml(text: string = ""): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function assembleHtml(template: string, appHtml: string, props: object, seo: Seo): string {
	let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
	html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
	const metasParts: string[] = [
		`<meta name="description" content="${escapeHtml(seo.description)}" />`,
		`<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
		`<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
	];
	if (seo.image) {
		metasParts.push(
			`<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
			`<meta name="twitter:card" content="summary_large_image" />`,
			`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
			`<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
			`<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`
		);
	}
	const metas = metasParts.join('\n    ');
	html = html.replace('</head>', `  ${metas}\n  </head>`);

	const serialized = serializeProps(props);
	html = html.replace(
		'<script type="module"',
		`<script>window.__INITIAL_PROPS__=${serialized}</script><script type="module"`
	);
	return html;
}

async function enrichInitialData(route: ReturnType<typeof matchRoute>, req: Request, props: any) {
	try {
		const commandLinks = await generateCommandLinks();
		props.initialData = { ...(props.initialData || {}), commandLinks };
	} catch (e) {
		console.error('Failed to build command links', e);
	}
	try {
		if (typeof route.getInitialData === 'function') {
			const data = await route.getInitialData({ url: req.url });
			props.initialData = { ...(props.initialData || {}), ...(data as object) };
		}
	} catch (e) {
		console.error('Failed to load route initial data', e);
	}
}

async function generateCommandLinks(): Promise<{ url: string; title: string; type: 'internal' | 'blog' | 'projects' }[]> {
	const blogDir = path.resolve('src/data/blog')
	const projectsDir = path.resolve('src/data/projects')

	async function listFromDir(dir: string, exts: string[]): Promise<{ slug: string; title: string }[]> {
		try {
			const entries = await fs.promises.readdir(dir)
			const files = entries.filter((f) => exts.some((ext) => f.toLowerCase().endsWith(ext)))
			const results: { slug: string; title: string }[] = []
			for (const file of files) {
				const content = await fs.promises.readFile(path.join(dir, file), 'utf8')
				let fm = ''
				if (content.startsWith('---')) {
					const end = content.indexOf('\n---', 3)
					fm = end !== -1 ? content.slice(3, end).trim() : ''
				}
				const slugMatch = /\bslug:\s*([^\n\r]+)/.exec(fm)
				const titleMatch = /\btitle:\s*([^\n\r]+)/.exec(fm)
				const publishedMatch = /\bpublished:\s*([^\n\r]+)/.exec(fm)
				const published = publishedMatch ? publishedMatch[1].trim().toLowerCase() !== 'false' : true
				const slug = (slugMatch ? slugMatch[1] : '').trim()
				const title = (titleMatch ? titleMatch[1] : '').trim()
				if (slug && title && published) results.push({ slug, title })
			}
			return results
		} catch {
			return []
		}
	}

	const [posts, projects] = await Promise.all([
		listFromDir(blogDir, ['.md']),
		listFromDir(projectsDir, ['.mdx'])
	])

	const internal = [
		{ url: '/blog', title: 'Blog', type: 'internal' as const },
		{ url: '/contact', title: 'Contact', type: 'internal' as const },
	]
	const postLinks = posts.map((p) => ({ url: `/blog/${p.slug}`, title: p.title, type: 'blog' as const }))
	const projectLinks = projects.map((p) => ({ url: `/work/${p.slug}`, title: p.title, type: 'projects' as const }))
	return [...internal, ...postLinks, ...projectLinks]
}

async function generateSitemapXml(): Promise<string> {
	const base = `https://www.maria-adriana.com`;

	const blogDir = path.resolve('src/data/blog');
	const projectsDir = path.resolve('src/data/projects');

	async function listSlugsFromDir(dir: string, exts: string[]): Promise<{ slug: string }[]> {
		try {
			const entries = await fs.promises.readdir(dir);
			const files = entries.filter((f) => exts.some((ext) => f.toLowerCase().endsWith(ext)));
			const results: { slug: string }[] = [];
			for (const file of files) {
				const content = await fs.promises.readFile(path.join(dir, file), 'utf8');
				let fm = '';
				if (content.startsWith('---')) {
					const end = content.indexOf('\n---', 3);
					fm = end !== -1 ? content.slice(3, end).trim() : '';
				}
				const slugMatch = /\bslug:\s*([^\n\r]+)/.exec(fm);
				const publishedMatch = /\bpublished:\s*([^\n\r]+)/.exec(fm);
				const published = publishedMatch
					? publishedMatch[1].trim().toLowerCase() !== 'false'
					: true;
				const slug = (slugMatch ? slugMatch[1] : '').trim();
				if (slug && published) results.push({ slug });
			}
			return results;
		} catch {
			return [];
		}
	}

	const [posts, projects] = await Promise.all([
		listSlugsFromDir(blogDir, ['.md']),
		listSlugsFromDir(projectsDir, ['.mdx'])
	]);

	const staticPaths = ['/', '/work', '/blog', '/contact'];
	const dynamicPaths = [
		...posts.map((p) => `/blog/${p.slug}`),
		...projects.map((p) => `/work/${p.slug}`)
	];

	const urls = [...staticPaths, ...dynamicPaths];
	const xmlNodes = urls.map((u) => `  <url>\n    <loc>${base}${u}</loc>\n  </url>`).join('\n');

	return (
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		`${xmlNodes}\n` +
		`</urlset>`
	);
}

async function start() {
	if (USE_HMR) {
		const app = express();
		const httpServer = http.createServer(app);
		const { createServer: createViteServer } = await import('vite');
		const vite = await createViteServer({
			server: { middlewareMode: true, hmr: { server: httpServer } },
			appType: 'custom',
			logLevel: 'info'
		});

		app.use(express.json());
		app.use('/api', apiRouter);
		app.use(vite.middlewares);

		// Sitemap route (dev)
		app.get('/sitemap.xml', async (_req, res) => {
			try {
				const xml = await generateSitemapXml();
				res.status(200).setHeader('Content-Type', 'application/xml').end(xml);
			} catch (e: any) {
				console.error(e);
				res.status(500).end('Failed to generate sitemap');
			}
		});

		async function handleRender(req: Request, res: Response, status = 200) {
			try {
				const templatePath = path.resolve('index.html');
				const rawTemplate = await fs.promises.readFile(templatePath, 'utf-8');
				const template = await vite.transformIndexHtml(req.originalUrl, rawTemplate);

				const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
				const route = matchRoute(req);
				const props = route.getProps({ url: req.url });
				await enrichInitialData(route, req, props);
				const appHtml = render(props);
				const seo = route.getSeo({ path: req.path, url: req.url });
				const html = assembleHtml(template, appHtml, props, seo);
				res.status(status).setHeader('Content-Type', 'text/html').end(html);
			} catch (e: any) {
				vite.ssrFixStacktrace(e);
				console.error(e);
				res.status(500).end(e?.message || 'SSR render error');
			}
		}

		app.get(['/', '/work', '/blog', '/contact'], (req, res) =>
			handleRender(req, res)
		);
		app.get(/.*/, (req, res) => handleRender(req, res, 404));

		httpServer.listen(PORT, () => {
			console.log(`Dev SSR + HMR running at http://localhost:${PORT}`);
		});
		return;
	}

	// Production server (prebuilt client + SSR bundle)
	const app = express();
	const { render } = await import('./dist-ssr/entry-server.js');
	app.use(express.json());
	app.use('/api', apiRouter);

	// Sitemap route (prod)
	app.get('/sitemap.xml', async (_req: Request, res: Response) => {
		try {
			const xml = await generateSitemapXml();
			res.status(200).setHeader('Content-Type', 'application/xml').end(xml);
		} catch (e: any) {
			console.error(e);
			res.status(500).end('Failed to generate sitemap');
		}
	});

	app.get(
		['/', '/work', '/blog', '/contact'],
		(req: Request, res: Response, _next: NextFunction) => {
			const htmlFilePath = path.resolve('dist/index.html');
			fs.readFile(htmlFilePath, 'utf-8', (err, template) => {
				if (err) {
					console.error(err);
					return res.status(500).send('Some error happened');
				}
				const route = matchRoute(req);
				const props = route.getProps({ url: req.url });
				Promise.resolve(enrichInitialData(route, req, props))
					.then(() => {
						const appHtml = render(props);
						const seo = route.getSeo({ path: req.path, url: req.url });
						const finalHtml = assembleHtml(template, appHtml, props, seo);
						return res.send(finalHtml);
					})
					.catch((e) => {
						console.error(e);
						const appHtml = render(props);
						const seo = route.getSeo({ path: req.path, url: req.url });
						const finalHtml = assembleHtml(template, appHtml, props, seo);
						return res.send(finalHtml);
					});
			});
		}
	);

	app.use(express.static('dist'));

	app.get(/.*/, (req: Request, res: Response) => {
		const htmlFilePath = path.resolve('dist/index.html');
		fs.readFile(htmlFilePath, 'utf-8', (err, template) => {
			if (err) {
				console.error(err);
				return res.status(500).send('Some error happened');
			}
			const route = matchRoute(req);
			const props = route.getProps({ url: req.url });
			Promise.resolve(enrichInitialData(route, req, props))
				.then(async () => {
					const appHtml = render(props);
					const seo = await route.getSeo({ path: req.path, url: req.url });
					const finalHtml = assembleHtml(template, appHtml, props, seo);
					return res.status(404).send(finalHtml);
				})
				.catch(async (e) => {
					console.error(e);
					const appHtml = render(props);
					const seo = await route.getSeo({ path: req.path, url: req.url });
					const finalHtml = assembleHtml(template, appHtml, props, seo);
					return res.status(404).send(finalHtml);
				});
		});
	});

	app.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}`);
	});
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
