import type { RouteModule } from '../types'

type WorkData = Record<string, never>

const workRoute: RouteModule<WorkData> = {
  path: '/work',
  getProps: (req) => ({ location: req.url }),
  getSeo: (_ctx) => ({
    title: 'Work | Portfolio',
    description: 'Selected projects and professional work.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default workRoute
