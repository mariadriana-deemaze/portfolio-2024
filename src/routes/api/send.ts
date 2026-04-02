import { createFileRoute } from '@tanstack/react-router';

import { handleSendPost } from '@/server/routes/api/send/post';

export const Route = createFileRoute('/api/send')({
	server: {
		handlers: {
			POST: ({ request }) => handleSendPost(request)
		}
	}
});
