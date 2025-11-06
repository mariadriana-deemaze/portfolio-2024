import type { RouteModule } from '../types'
import { getPost, type BlogPost } from '../../src/data/blog'
import { renderMdxToHtml } from '../mdx'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type BlogItemData = { post?: BlogPost; postHtml?: string }

const blogItemRoute: RouteModule<BlogItemData> = {
  path: /^\/blog\/([^/]+)$/,
  getProps: (req) => ({ location: req.url }),
  async getInitialData(req) {
    try {
      const match = /^\/blog\/([^/]+)$/.exec(new URL(req.url, 'http://localhost').pathname)
      const slug = match?.[1]
      if (!slug) return { post: undefined }
      const post = await getPost(slug)
      const postHtml = post?.body ? await renderMdxToHtml(post.body) : undefined
      return { post, postHtml }
    } catch (e) {
      console.error('Failed to load blog post', e)
      return { post: undefined }
    }
  },
  getSeo: (ctx) => {
    try {
      const slug = ctx.path.split('/').pop() || ''
      if (slug) {
        const dir = path.resolve('src/data/blog')
        try {
          const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.md'))
          for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8')
            const { data } = matter(content)
            if ((data as any)?.slug === slug) {
              const title = (data as any)?.title
              const description = (data as any)?.description
              if (title && description) {
                return {
                  title: `${title} | Blog`,
                  description,
                }
              }
              break
            }
          }
        } catch {
          // noop
        }
      }
      return {
        title: 'Blog Post',
        description: 'Blog article.',
      }
    } catch {
      return {
        title: 'Blog Post',
        description: 'Blog article.',
      }
    }
  },
}

export default blogItemRoute

