import { createFileRoute } from '@tanstack/react-router';

import { createOpenApiDocument } from '@/server/agent-ready';

export const Route = createFileRoute('/api/openapi.json/')({
	server: {
		handlers: {
			GET: () => {
				const body = JSON.stringify(createOpenApiDocument(), null, 2);

				return new Response(body, {
					status: 200,
					headers: {
						'Content-Type': 'application/openapi+json; charset=utf-8'
					}
				});
			}
		}
	}
});
