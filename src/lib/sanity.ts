import { getRequestHeader } from '@tanstack/react-start/server';
import { z } from 'zod';

import { publicEnvSchema } from '@/lib/env';

const sanityQueryResponseSchema = z.object({
	result: z.unknown()
});

const env = publicEnvSchema.parse(import.meta.env);
const isStudioRuntime = Boolean(
	import.meta.env.SANITY_STUDIO_PROJECT_ID || import.meta.env.SANITY_STUDIO_DATASET
);

function getSanityConfig() {
	if (isStudioRuntime)
		throw new Error('Sanity client should only be initialized for the website runtime.');

	return {
		apiVersion: env.VITE_SANITY_API_VERSION,
		dataset: env.VITE_SANITY_DATASET,
		projectId: env.VITE_SANITY_PROJECT_ID,
		useCdn: env.VITE_SANITY_USE_CDN
	};
}

function getLocaleFromRequest(): string {
	try {
		const cookie = getRequestHeader('cookie') ?? '';
		const match = cookie.match(/locale=(\w+)/);
		const val = match?.[1];
		return val === 'pt' ? 'pt' : 'en';
	} catch {
		return 'en';
	}
}

export async function fetchSanityQuery<T>(
	query: string,
	params: Record<string, unknown> = {}
): Promise<T> {
	const config = getSanityConfig();
	const host = config.useCdn ? 'apicdn.sanity.io' : 'api.sanity.io';
	const url = new URL(
		`https://${config.projectId}.${host}/v${config.apiVersion}/data/query/${config.dataset}`
	);

	url.searchParams.set('query', query);

	const mergedParams = { locale: getLocaleFromRequest(), ...params };
	for (const [key, value] of Object.entries(mergedParams)) {
		url.searchParams.set(`$${key}`, JSON.stringify(value));
	}

	const response = await fetch(url, {
		headers: {
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`Sanity request failed with status ${response.status}`);
	}

	const payload = sanityQueryResponseSchema.parse(await response.json());

	return payload.result as T;
}
