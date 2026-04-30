import { createFileRoute } from '@tanstack/react-router';

import { handleHealthGet } from '@/server/routes/api/health/get';

export const Route = createFileRoute('/api/health')({
	server: {
		handlers: {
			GET: handleHealthGet
		}
	}
});
