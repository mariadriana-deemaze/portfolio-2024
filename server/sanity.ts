import { z } from 'zod';
import { getEnv, publicEnvSchema } from '@/lib/env';

if (typeof window !== 'undefined') {
	throw new Error('server/sanity module cannot be imported in client code');
}

const sanityMutationResponseSchema = z.object({
	transactionId: z.string().optional(),
	documentId: z.string().optional(),
	results: z.array(z.looseObject({}))
});

const publicEnv = publicEnvSchema.parse(import.meta.env);

function getSanityWriteConfig() {
	const serverEnv = getEnv();
	return {
		apiVersion: publicEnv.VITE_SANITY_API_VERSION,
		dataset: publicEnv.VITE_SANITY_DATASET,
		projectId: publicEnv.VITE_SANITY_PROJECT_ID,
		writeToken: serverEnv.SANITY_API_WRITE_TOKEN
	};
}

export async function mutateInSanity(
	mutations: Array<{
		patch?: Record<string, unknown>;
		set?: Record<string, unknown>;
		create?: Record<string, unknown>;
	}>
) {
	const config = getSanityWriteConfig();

	if (!config.writeToken) {
		throw new Error('SANITY_API_WRITE_TOKEN is not configured');
	}

	const url = new URL(
		`https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/mutate/${config.dataset}`
	);

	const response = await fetch(url.toString(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.writeToken}`
		},
		body: JSON.stringify({ mutations })
	});

	if (!response.ok) {
		const errorData = await response.text();
		throw new Error(`Sanity mutation failed with status ${response.status}: ${errorData}`);
	}

	return sanityMutationResponseSchema.parse(await response.json());
}
