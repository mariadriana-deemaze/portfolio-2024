import type { Request } from 'express'
import type { RouteModule } from '../types'
import { getServerSideProps as getHomeServerSideProps, SeoMetadata as homeSeo } from '../../src/routes/index'
import { getServerSideProps as getWorkServerSideProps, SeoMetadata as workSeo } from '../../src/routes/work/index'
import { getServerSideProps as getWorkItemServerSideProps, SeoMetadata as workItemSeo } from '../../src/routes/work/$slug'
import { getServerSideProps as getBlogServerSideProps, SeoMetadata as blogSeo } from '../../src/routes/blog/index'
import { getServerSideProps as getBlogItemServerSideProps, SeoMetadata as blogItemSeo } from '../../src/routes/blog/$slug'
import { data, BASE_URL } from '../../src/data/main'

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
    path: '/',
    getProps: (req) => ({ location: req.url }),
    getInitialData: getHomeServerSideProps,
    getSeo: homeSeo,
  },
  {
    path: /^\/work\/([^/]+)$/,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getWorkItemServerSideProps,
    getSeo: workItemSeo,
  },
  {
    path: '/work',
    getProps: (req) => ({ location: req.url }),
    getInitialData: getWorkServerSideProps,
    getSeo: workSeo,
  },
  {
    path: /^\/blog\/([^/]+)$/,
    getProps: (req) => ({ location: req.url }),
    getInitialData: getBlogItemServerSideProps,
    getSeo: blogItemSeo,
  },
  {
    path: /^\/blog\/?$/,
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
