import type { RouteModule } from '../types'

type NotFoundData = Record<string, never>

const notFoundRoute: RouteModule<NotFoundData> = {
  path: /.*/,
  getProps: (req) => ({ location: req.url }),
  getSeo: (_ctx) => ({
    title: '404 | Page Not Found',
    description: 'The page you requested could not be found.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default notFoundRoute
