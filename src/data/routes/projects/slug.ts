import type { RouteModule } from '@/server/types'

import { BASE_URL } from '@/data/main'
import { getProject, type Project } from '@/data/projects'
import { renderMdxToHtml } from '@/server/mdx'
import { ROUTE_PATTERNS } from '@/utils/routes'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

type ProjectItemData = { project?: Project; projectHtml?: string }

export const getServerSideProps: RouteModule<ProjectItemData>['getInitialData'] = async (req) => {
  try {
    const match = ROUTE_PATTERNS.projectsItem.exec(new URL(req.url, 'http://localhost').pathname)
    const slug = match?.[1]
    if (!slug) return { project: undefined }
    const project = await getProject(slug)
    const projectHtml = project?.content ? await renderMdxToHtml(project.content) : undefined
    return { project, projectHtml }
  } catch (e) {
    console.error('Failed to load work item project', e)
    return { project: undefined }
  }
}

export const SeoMetadata: RouteModule<ProjectItemData>['getSeo'] = (ctx) => {
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
            const title = data?.title
            const description = data.description
            const hero = data.hero
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
      } catch {
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
}
