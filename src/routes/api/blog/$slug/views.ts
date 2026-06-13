import { createFileRoute } from '@tanstack/react-router';

import { handleViewsPost } from '@/server/routes/api/blog/views/post';

export const Route = createFileRoute('/api/blog/$slug/views')({
	server: {
		handlers: {
			POST: ({ request }) => handleViewsPost(request)
		}
	}
});
