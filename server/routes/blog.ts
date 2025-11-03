import type { RouteModule } from '../types'

type BlogData = Record<string, never>

const blogRoute: RouteModule<BlogData> = {
  path: '/blog',
  getProps: (req) => ({ location: req.url }),
  getSeo: (_ctx) => ({
    title: 'Blog | Portfolio',
    description: 'Thoughts, writing, and updates.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default blogRoute
