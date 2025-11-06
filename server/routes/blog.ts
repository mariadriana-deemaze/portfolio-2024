import type { RouteModule } from '../types'
import { getPosts, type BlogPost } from '../../src/data/blog'

type BlogData = { posts?: BlogPost[] }

const blogRoute: RouteModule<BlogData> = {
  path: '/blog',
  getProps: (req) => ({ location: req.url }),
  async getInitialData(_req) {
    try {
      const posts = await getPosts()
      return { posts }
    } catch (e) {
      console.error('Failed to load posts', e)
      return { posts: [] }
    }
  },
  getSeo: (_ctx) => ({
    title: 'Blog | Portfolio',
    description: 'Thoughts, writing, and updates.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default blogRoute
