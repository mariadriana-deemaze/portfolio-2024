import { createFileRoute } from '@tanstack/react-router';

import { handleAuthorizeGet } from '@/server/routes/api/spotify/authorize/get';

export const Route = createFileRoute('/api/spotify/authorize')({
	server: {
		handlers: {
			GET: ({ request }) => handleAuthorizeGet(request)
		}
	}
});
