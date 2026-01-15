import type { BlogPost } from '@/data/blog'
import type { RouteModule } from '@/server/types'

import { getPost } from '@/data/blog'
import { BASE_URL } from '@/data/main'
import { renderMdxToHtml } from '@/server/mdx'
import { ROUTE_PATTERNS } from '@/utils/routes'

type BlogItemData = { post?: BlogPost; postHtml?: string }

const notFoundRoute: RouteModule = {
  path: /.*/,
  getProps: (req) => ({ location: req.url }),
  getSeo: () => ({
    title: `Not found`,
    description: 'The requested blog post could not be located.',
  }),
}

export const getServerSideProps: RouteModule<BlogItemData>['getInitialData'] = async (req) => {
  try {
    const match = ROUTE_PATTERNS.blogItem.exec(new URL(req.url, 'http://localhost').pathname)
    const slug = match?.[1]
    if (!slug) return { post: undefined }
    const post = await getPost(slug)
    const postHtml = post?.body ? await renderMdxToHtml(post.body) : undefined
    return { post, postHtml }
  } catch (e) {
    console.error('Failed to load blog post', e)
    return { post: undefined }
  }
}

export const SeoMetadata: RouteModule<BlogItemData>['getSeo'] = async (ctx) => {
  const slug = ctx.path.split('/').pop() || ''
  const post = await getPost(slug)

  if (!post) {
    return notFoundRoute.getSeo(ctx)
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}${ctx.path}`,
    },
  }
}
