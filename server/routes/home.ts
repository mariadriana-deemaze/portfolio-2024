import type { RouteModule } from '../types'

type HomeData = Record<string, never>

const homeRoute: RouteModule<HomeData> = {
  path: '/',
  getProps: (req) => ({ location: req.url }),
  getSeo: (_ctx) => ({
    title: 'Home | Portfolio',
    description: 'Welcome to my portfolio homepage.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default homeRoute
