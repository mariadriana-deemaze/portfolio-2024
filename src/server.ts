import handler, { createServerEntry } from '@tanstack/react-start/server-entry';

import {
	AGENT_DISCOVERY_LINKS,
	createMarkdownResponse,
	getMarkdownDocument,
	isMarkdownPath,
	requestWantsMarkdown
} from '@/server/agent-ready';

export default createServerEntry({
	async fetch(request, opts) {
		const pathname = new URL(request.url).pathname;
		const markdownPath = isMarkdownPath(pathname);

		if (markdownPath && requestWantsMarkdown(request.headers.get('accept'))) {
			const markdown = await getMarkdownDocument(pathname);

			if (markdown) {
				return createMarkdownResponse(markdown);
			}
		}

		const response = await handler.fetch(request, opts);

		if (markdownPath) {
			response.headers.append('Vary', 'Accept');
		}

		if (pathname === '/') {
			for (const linkValue of AGENT_DISCOVERY_LINKS) {
				response.headers.append('Link', linkValue);
			}
		}

		return response;
	}
});
