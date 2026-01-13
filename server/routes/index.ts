import type { Request } from 'express'
import type { RouteModule } from '@/server/types'
import { getServerSideProps as getHomeServerSideProps, SeoMetadata as homeSeo } from '@/routes/index'
import { getServerSideProps as getProjectServerSideProps, SeoMetadata as projectSeo } from '@/routes/projects/index'
import { getServerSideProps as getProjectItemServerSideProps, SeoMetadata as projectItemSeo } from '@/routes/projects/$slug'
import { getServerSideProps as getBlogServerSideProps, SeoMetadata as blogSeo } from '@/routes/blog/index'
import { getServerSideProps as getBlogItemServerSideProps, SeoMetadata as blogItemSeo } from '@/routes/blog/$slug'
import { data, BASE_URL } from '@/data/main'
import { ROUTE_PATTERNS, ROUTES } from '@/utils/routes'

const notFoundRoute: RouteModule = {
  path: /.*/,
  getProps: (req) => ({ location: req.url }),
  getSeo: () => ({
    title: `${data.name} | ${data.role} :: You seem lost`,
    description:
      "The page you're looking for isn't here. Navigate back to Maria Adriana's projects, blog, or contact page — or get in touch to discuss full stack development solutions.",
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
    alternates: {
      canonical: `${BASE_URL}/`,
    },
  }),
};

const routes: RouteModule[] = [
  {
    path: ROUTES.home,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getHomeServerSideProps,
    getSeo: homeSeo,
  },
  {
    path: ROUTE_PATTERNS.projectsItem,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getProjectItemServerSideProps,
    getSeo: projectItemSeo,
  },
  {
    path: ROUTE_PATTERNS.projectsIndex,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getProjectServerSideProps,
    getSeo: projectSeo,
  },
  {
    path: ROUTE_PATTERNS.blogItem,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getBlogItemServerSideProps,
    getSeo: blogItemSeo,
  },
  {
    path: ROUTE_PATTERNS.blogIndex,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getBlogServerSideProps,
    getSeo: blogSeo,
  },
  notFoundRoute,
]

export function matchRoute(req: Request): RouteModule {
  for (const route of routes) {
    if (typeof route.path === 'string') {
      if (req.path === route.path) return route
    } else {
      if (route.path.test(req.path)) return route
    }
  }
  return routes[routes.length - 1]
}
