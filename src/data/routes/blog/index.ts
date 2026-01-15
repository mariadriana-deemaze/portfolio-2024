import type { BlogPost } from '@/data/blog'
import type { RouteModule } from '@/server/types'

import { getPosts } from '@/data/blog'
import { data, BASE_URL } from '@/data/main'
import { ROUTES } from '@/utils/routes'

type BlogData = { posts?: BlogPost[] }

export const getServerSideProps: RouteModule<BlogData>['getInitialData'] = async () => {
  try {
    const posts = await getPosts()
    return { posts }
  } catch (e) {
    console.error('Failed to load posts', e)
    return { posts: [] }
  }
}

export const SeoMetadata: RouteModule<BlogData>['getSeo'] = () => ({
  title: `${data.name} | ${data.role} :: Blog`,
  description:
    "Explore Maria Adriana's insights on Full Stack Development, with in-depth articles on problem-solving strategies, architecture decisions, performance optimization, and modern web technologies.",
  alternates: {
    canonical: `${BASE_URL}${ROUTES.blog}`,
  },
})
