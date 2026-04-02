import { BASE_URL, data } from '@/data/main';
import type { Seo } from '@/server/types';
import { ROUTES } from '@/utils/routes';

export function SeoMetadata(): Seo {
	return {
		title: `${data.name} | ${data.role}`,
		description:
			'Maria Adriana is a full stack developer based in Portugal, specializing in modern web technologies including Node.js, NestJS, Next.js, TypeScript, and React. Passionate about building scalable, maintainable, and high-performance applications.',
		alternates: {
			canonical: `${BASE_URL}${ROUTES.home}`
		}
	};
}
