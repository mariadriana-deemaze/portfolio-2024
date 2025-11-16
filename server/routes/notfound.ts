import { data } from '../../src/data/main'
import type { RouteModule } from '../types'

type NotFoundData = Record<string, never>

const notFoundRoute: RouteModule<NotFoundData> = {
  path: /.*/,
  getProps: (req) => ({ location: req.url }),
  getSeo: (_ctx) => ({
    title: `${data.name} | ${data.role} :: You seem lost`,
    description: 'The page you’re looking for isn’t here. Navigate back to Maria Adriana’s projects, blog, or contact page — or get in touch to discuss full stack development solutions.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

// TODO
/* alternates: {
  canonical: 'https://maria-adriana.com/'
} */

export default notFoundRoute
