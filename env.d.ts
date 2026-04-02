/// <reference types="vite/client" />

type PublicEnvVariable =
	| 'VITE_SANITY_PROJECT_ID'
	| 'VITE_SANITY_DATASET'
	| 'VITE_SANITY_API_VERSION'
	| 'VITE_SANITY_USE_CDN';
type ServerEnvVariable =
	| 'SPOTIFY_CLIENT_ID'
	| 'SPOTIFY_CLIENT_SECRET'
	| 'SPOTIFY_REFRESH_TOKEN'
	| 'SMTP_HOST'
	| 'SMTP_PORT'
	| 'SMTP_TO'
	| 'SMTP_FROM'
	| 'SMTP_PASSWORD';

type PublicEnvVariables = Partial<Record<PublicEnvVariable, string>>;

type ServerEnvVariables = Partial<Record<ServerEnvVariable, string>>;

interface ImportMetaEnv extends PublicEnvVariables {}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
	interface ProcessEnv extends PublicEnvVariables, ServerEnvVariables {}
}
