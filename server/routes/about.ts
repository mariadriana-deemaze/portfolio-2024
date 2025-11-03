import type { RouteModule } from '../types'

export type AboutData = {
  message: string
}

const aboutRoute: RouteModule<AboutData> = {
  path: '/about',
  getProps: (req) => ({
    location: req.url,
    initialData: { message: 'Hello world' },
  }),
  getSeo: (_ctx) => ({
    title: 'About | Portfolio',
    description: 'About me and this site.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default aboutRoute
