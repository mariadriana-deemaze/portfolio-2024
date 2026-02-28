import type { Seo } from '@/server/types'

import { data, BASE_URL } from '@/data/main'
import { ROUTES } from '@/utils/routes'

export function SeoMetadata(): Seo {
  return {
  title: `${data.name} | ${data.role} :: Projects`,
  description:
    "Explore Maria Adriana's full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.",
  alternates: {
    canonical: `${BASE_URL}${ROUTES.projects}`,
  },
  }
}
