import { BASE_URL } from '@/data/main';
import type { Seo } from '@/server/types';

const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-preview.png`;

export function createSeoHead(seo: Seo) {
	const image = seo.image ?? DEFAULT_OG_IMAGE;

	return {
		meta: [
			{ title: seo.title },
			{ name: 'description', content: seo.description },
			{ property: 'og:title', content: seo.title },
			{ property: 'og:description', content: seo.description },
			{ property: 'og:type', content: seo.type ?? 'website' },
			{ property: 'og:image', content: image },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:image', content: image },
			...(seo.url ? [{ property: 'og:url', content: seo.url }] : [])
		],
		links: seo.alternates?.canonical
			? [{ rel: 'canonical', href: seo.alternates.canonical }]
			: undefined
	};
}
