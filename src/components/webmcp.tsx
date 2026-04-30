import { useEffect } from 'react';

import { data } from '@/data/main';
import { ROUTES } from '@/utils/routes';

const SITE_ROUTES = [ROUTES.home, ROUTES.projects, ROUTES.blog, ROUTES.contact] as const;

type ToolDefinition = {
	name: string;
	description: string;
	inputSchema?: Record<string, unknown>;
	execute: (input: Record<string, unknown>) => Promise<unknown>;
	annotations?: {
		readOnlyHint?: boolean;
	};
};

type NavigatorWithModelContext = Navigator & {
	modelContext?: {
		provideContext?: (context: { tools: ToolDefinition[] }) => void;
		registerTool?: (tool: ToolDefinition) => void;
		unregisterTool?: (name: string) => void;
	};
};

function normalizeSitePath(value: unknown): string {
	return typeof value === 'string' && value.startsWith('/') ? value : ROUTES.home;
}

async function fetchJson(path: string) {
	const response = await fetch(path);
	return response.json();
}

const WEBMCP_TOOLS: ToolDefinition[] = [
	{
		name: 'portfolio.get_profile',
		description: 'Read the site owner profile, location, contact email, and key navigation routes.',
		annotations: {
			readOnlyHint: true
		},
		execute: async () => ({
			name: data.name,
			role: data.role,
			location: data.location,
			email: data.contact.email,
			routes: SITE_ROUTES
		})
	},
	{
		name: 'portfolio.fetch_markdown',
		description:
			'Fetch the current page or another route from this site as markdown using Accept: text/markdown.',
		inputSchema: {
			type: 'object',
			properties: {
				path: {
					type: 'string',
					description: 'A site-relative path such as /, /projects, /blog, or /contact.'
				}
			},
			required: ['path'],
			additionalProperties: false
		},
		annotations: {
			readOnlyHint: true
		},
		execute: async (input) => {
			const path = normalizeSitePath(input.path);
			const response = await fetch(path, {
				headers: {
					Accept: 'text/markdown'
				}
			});

			return {
				path,
				ok: response.ok,
				contentType: response.headers.get('content-type'),
				markdown: await response.text()
			};
		}
	},
	{
		name: 'portfolio.get_now_playing',
		description: 'Read the current Spotify now-playing status shown on the portfolio site.',
		annotations: {
			readOnlyHint: true
		},
		execute: async () => fetchJson('/api/spotify/currently-playing')
	},
	{
		name: 'portfolio.navigate',
		description: 'Navigate the current browser tab to a supported portfolio route.',
		inputSchema: {
			type: 'object',
			properties: {
				path: {
					type: 'string',
					enum: SITE_ROUTES
				}
			},
			required: ['path'],
			additionalProperties: false
		},
		execute: async (input) => {
			const path = normalizeSitePath(input.path);
			window.location.assign(path);

			return {
				ok: true,
				navigatedTo: path
			};
		}
	}
];

export function WebMcpRegistration() {
	useEffect(() => {
		const modelContext = (navigator as NavigatorWithModelContext).modelContext;
		if (!modelContext) return;

		if (typeof modelContext.provideContext === 'function') {
			modelContext.provideContext({ tools: WEBMCP_TOOLS });
			return;
		}

		if (typeof modelContext.registerTool !== 'function') {
			return;
		}

		for (const tool of WEBMCP_TOOLS) {
			try {
				modelContext.unregisterTool?.(tool.name);
			} catch {
				// No-op
			}

			modelContext.registerTool(tool);
		}
	}, []);

	return null;
}
