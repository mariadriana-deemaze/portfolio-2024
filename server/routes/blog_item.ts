import type { RouteModule } from '../types'
import { getPost, type BlogPost } from '../../src/data/blog'
import { renderMdxToHtml } from '../mdx'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type BlogItemData = { post?: BlogPost; postHtml?: string };

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
  async getSeo(ctx) {
    const slug = ctx.path.split('/').pop() || '';
    const post = await getPost(slug);
    
    if (!post) {
      const notFound = require('./notfound').default as RouteModule
      return notFound.getSeo(ctx)
    }

    return {
      title: `${post.title} | Blog`,
      description: post.description,
    }
  },
}

export default blogItemRoute
