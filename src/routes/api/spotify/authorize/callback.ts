import { createFileRoute } from '@tanstack/react-router';

import { handleAuthorizeCallbackGet } from '@/server/routes/api/spotify/authorize/callback/get';

export const Route = createFileRoute('/api/spotify/authorize/callback')({
	server: {
		handlers: {
			GET: ({ request }) => handleAuthorizeCallbackGet(request)
		}
	}
});
