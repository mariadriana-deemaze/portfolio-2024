import { createFileRoute } from '@tanstack/react-router';

import { handleCurrentlyPlayingGet } from '@/server/routes/api/spotify/currently-playing/get';

export const Route = createFileRoute('/api/spotify/currently-playing')({
	server: {
		handlers: {
			GET: handleCurrentlyPlayingGet
		}
	}
});
