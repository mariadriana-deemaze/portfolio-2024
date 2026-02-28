export const ROUTES = {
  home: '/',
  projects: '/projects',
  blog: '/blog',
  contact: '/contact',
} as const

export const STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.projects,
  ROUTES.blog,
  ROUTES.contact,
] as const

export function toProjectsSlug(slug: string): string {
  return `${ROUTES.projects}/${slug}`
}

export function toBlogSlug(slug: string): string {
  return `${ROUTES.blog}/${slug}`
}
