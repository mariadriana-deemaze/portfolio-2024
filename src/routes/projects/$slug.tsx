import type { RouteModule } from '@/server/types'
import { STACKS } from '@/components/stacks'
import { Badge } from '@/components/ui/badge'
import { BASE_URL } from '@/data/main'
import { getProject, type Project } from '@/data/projects'
import { renderMdxToHtml } from '@/server/mdx'
import { ROUTES, ROUTE_PATTERNS } from '@/utils/routes'
import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { JSX, isValidElement } from 'react'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectItemRoute,
})

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

function ProjectItemRoute(): JSX.Element {
  const router = useRouter()
  const project = router.options.context.initialData?.project
  const html = router.options.context.initialData.projectHtml

  if (!project) {
    return (
      <div>
        <h1>Project not found</h1>
        <p>The requested project could not be located.</p>
        <p>
          <a href={ROUTES.projects}>Back to projects</a>
        </p>
      </div>
    )
  }

  const { title, year, description, hero, technologies = [], repo, liveUrl } = project

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="font-mono text-sm text-gray-500">
        <a href={ROUTES.projects} className="hover:underline">
          &larr; Back to projects
        </a>
      </p>
      <header className="space-y-2">
        <div className='flex flex-col mt-6'>
          <time className="font-mono text-xs text-gray-500">YEAR {year}</time>
          <h1 className="font-clash font-bold text-5xl text-fade-grad">{title}</h1>
        </div>
        <p className="font-mono text-sm text-foreground">{description}</p>
        <div className="flex flex-wrap gap-1 my-6">
          {technologies.map(({ label, icon }) => {
            const resolvedIcon = isValidElement(icon) ? icon : Object.values(STACKS).find((t) => t.label === label)?.icon ?? null;
            return (
              <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline" key={label}>
                {resolvedIcon}
                <span>{label}</span>
              </Badge>
            )
          })}
        </div>
        <hr className="mt-2" />
      </header>
      <section className="summary flex gap-1 flex-row-reverse mb-8">
        <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline">
          <a className="flex flex-row gap-2" href={repo ? "${data.github}/${repo}" : "#"} target="_blank" rel="noreferrer">
            View repo
          </a>
        </Badge>
        {liveUrl && (
          <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline">
            <a className="flex flex-row gap-2" href={liveUrl} target="_blank" rel="noreferrer">
              Live demo
            </a>
          </Badge>
        )}
      </section>
      {hero && (
        <img className="border border-gray-400/30 dark:border-gray-200/10 self-center rounded-md" alt={"Hero image of the ${title} project."} width={800} height={400} src={hero} />
      )}
      <article className="content mt-4">
        <div className="prose font-mono dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  )
}
