import { BASE_URL, data } from '@/data/main';
import type { Seo } from '@/server/types';
import { ROUTES } from '@/utils/routes';

export function SeoMetadata(): Seo {
	const url = `${BASE_URL}${ROUTES.projects}`;
	return {
		title: `${data.name} | ${data.role} :: Projects`,
		description:
			"Explore Maria Adriana's full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.",
		url,
		alternates: { canonical: url }
	};
}
