import { BASE_URL, data } from '@/data/main';
import type { Seo } from '@/server/types';
import { ROUTES } from '@/utils/routes';

export function SeoMetadata(): Seo {
	const url = `${BASE_URL}${ROUTES.blog}`;
	return {
		title: `${data.name} | ${data.role} :: Blog`,
		description:
			"Explore Maria Adriana's insights on Full Stack Development, with in-depth articles on problem-solving strategies, architecture decisions, performance optimization, and modern web technologies.",
		url,
		alternates: { canonical: url }
	};
}
