import { createFileRoute } from '@tanstack/react-router';

import { createApiCatalogDocument } from '@/server/agent-ready';

const contentType = 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export const Route = createFileRoute('/.well-known/api-catalog')({
	server: {
		handlers: {
			GET: () => {
				const body = JSON.stringify(createApiCatalogDocument(), null, 2);

				return new Response(body, {
					status: 200,
					headers: {
						'Content-Type': contentType,
						Link: '</.well-known/api-catalog>; rel="api-catalog"'
					}
				});
			}
		}
	}
});
