import { z } from 'zod';

export const publicEnvSchema = z.object({
	VITE_SANITY_PROJECT_ID: z.string().trim().min(1),
	VITE_SANITY_DATASET: z.string().trim().min(1),
	VITE_SANITY_API_VERSION: z.string().trim().min(1),
	VITE_SANITY_USE_CDN: z.stringbool().prefault('true')
});

const serverEnvSchema = z.object({
	SPOTIFY_CLIENT_ID: z.string().trim().min(1),
	SPOTIFY_CLIENT_SECRET: z.string().trim().min(1),
	SPOTIFY_REFRESH_TOKEN: z.string().trim().min(1),
	SMTP_HOST: z.string().trim().min(1),
	SMTP_PORT: z.coerce.number().int().positive(),
	SMTP_TO: z.string().trim().min(1),
	SMTP_FROM: z.string().trim().min(1),
	SMTP_PASSWORD: z.string().trim().min(1)
});

const envSchema = publicEnvSchema.extend(serverEnvSchema.shape);

export type Env = z.infer<typeof envSchema>;

let env: Env | undefined;

export function getEnv(): Env {
	env ??= envSchema.parse(
		(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ??
			import.meta.env
	);
	return env;
}
