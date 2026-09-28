import { z } from 'zod';
import { getEnv } from '@/lib/env';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const siteverifyResponseSchema = z.object({
	success: z.boolean(),
	'error-codes': z.array(z.string()).optional()
});

export async function verifyTurnstileToken(token: string, clientIp?: string): Promise<boolean> {
	const body = new URLSearchParams({
		secret: getEnv().TURNSTILE_SECRET_KEY,
		response: token
	});

	if (clientIp) {
		body.set('remoteip', clientIp);
	}

	try {
		const response = await fetch(SITEVERIFY_URL, { method: 'POST', body });
		const result = siteverifyResponseSchema.safeParse(await response.json());

		if (!result.success) {
			console.error('Unexpected Turnstile siteverify response.');
			return false;
		}

		if (!result.data.success) {
			console.warn('Turnstile challenge rejected:', result.data['error-codes']);
		}

		return result.data.success;
	} catch (error) {
		console.error('Turnstile verification request failed:', error);
		return false;
	}
}
