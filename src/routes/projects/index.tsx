import { createFileRoute } from '@tanstack/react-router'

import ProjectsList from '@/components/pages/projects'
import { SeoMetadata } from '@/data/routes/projects/index'
import { createSeoHead } from '@/lib/head'
import { getProjectsFn } from '@/server-fns/content'

export const Route = createFileRoute('/projects/')({
  loader: async () => {
    const projects = await getProjectsFn()

    return {
      projects,
    }
  },
  head: () => createSeoHead(SeoMetadata()),
  component: ProjectRoute,
})

function ProjectRoute() {
  const { projects } = Route.useLoaderData()

  return <ProjectsList projects={projects} />
}
