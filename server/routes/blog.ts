import type { RouteModule } from '../types'
import { getPosts, type BlogPost } from '../../src/data/blog'
import { data } from '@/data/main'
import { BASE_URL } from '.'

type BlogData = { posts?: BlogPost[] }

const blogRoute: RouteModule<BlogData> = {
  path: /^\/blog\/?$/,
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
    title: `${data.name} | ${data.role} :: Blog`,
    description:
      'Explore Maria Adriana’s insights on Full Stack Development, with in-depth articles on problem-solving strategies, architecture decisions, performance optimization, and modern web technologies.',
    alternates: {
      canonical: `${BASE_URL}/blog`,
    }
  }),
}

export default blogRoute
