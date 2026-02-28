import type { Seo } from '@/server/types'

export function createSeoHead(seo: Seo) {
  const meta = [
    { title: seo.title },
    { name: 'description', content: seo.description },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
  ]

  if (seo.image) {
    meta.push(
      { property: 'og:image', content: seo.image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: seo.image },
    )
  }

  return {
    meta,
    links: seo.alternates?.canonical
      ? [{ rel: 'canonical', href: seo.alternates.canonical }]
      : undefined,
  }
}
