import { createFileRoute } from '@tanstack/react-router';

import { createApiDocsMarkdown } from '@/server/agent-ready';

export const Route = createFileRoute('/docs/api')({
	server: {
		handlers: {
			GET: () => {
				const markdown = createApiDocsMarkdown();

				return new Response(markdown, {
					status: 200,
					headers: {
						'Content-Type': 'text/markdown; charset=utf-8'
					}
				});
			}
		}
	}
});
