import type { RouteModule } from '../types'
import { getProject, type Project } from '../../src/data/projects'
import { renderMdxToHtml } from '../mdx'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BASE_URL } from './index'

type WorkItemData = { project?: Project; projectHtml?: string }

const workItemRoute: RouteModule<WorkItemData> = {
  path: /^\/work\/([^/]+)$/,
  getProps: (req) => ({ location: req.url }),
  async getInitialData(req) {
    try {
      const match = /^\/work\/([^/]+)$/.exec(new URL(req.url, 'http://localhost').pathname)
      const slug = match?.[1]
      if (!slug) return { project: undefined }
      const project = await getProject(slug)
      const projectHtml = project?.content ? await renderMdxToHtml(project.content) : undefined
      return { project, projectHtml }
    } catch (e) {
      console.error('Failed to load work item project', e)
      return { project: undefined }
    }
  },
  getSeo: (ctx) => {
    try {
      const slug = ctx.path.split('/').pop() || ''
      if (slug) {
        const dir = path.resolve('src/data/projects')
        try {
          const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.mdx'))
          for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8')
            const { data } = matter(content)
            if (data?.slug === slug) {
              const title = data?.title;
              const description = data.description;
              const hero = data.hero;
              if (title && description) {
                return {
                  title: `${title} | Project`,
                  description,
                  image: hero,
                  alternates: {
                    canonical: `${BASE_URL}${ctx.path}`,
                  },
                }
              }
              break
            }
          }
        } catch (e) {
          // noop
        }
      }
      return {
        title: 'Project',
        description: 'Project details and information.',
        alternates: {
          canonical: `${BASE_URL}${ctx.path}`,
        },
      }
    } catch {
      return {
        title: 'Project',
        description: 'Project details and information.',
        alternates: {
          canonical: `${BASE_URL}${ctx.path}`,
        },
      }
    }
  },
}

export default workItemRoute
