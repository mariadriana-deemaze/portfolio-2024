import type { RouteModule } from '@/server/types'

import ProjectsList from '@/components/pages/projects'
import { data, BASE_URL } from '@/data/main'
import { getProjects, type Project } from '@/data/projects'
import { ROUTES } from '@/utils/routes'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/')({
  component: ProjectRoute,
})

function ProjectRoute() {
  const router = useRouter()
  const projects = router.options.context.initialData?.projects ?? []
  return <ProjectsList projects={projects} />
}

type ProjectData = { projects: Project[] }

export const getServerSideProps: RouteModule<ProjectData>['getInitialData'] = async () => {
  try {
    const projects = await getProjects()
    return { projects }
  } catch (e) {
    console.error('Failed to load projects', e)
    return { projects: [] }
  }
}

export const SeoMetadata: RouteModule<ProjectData>['getSeo'] = () => ({
  title: `${data.name} | ${data.role} :: Projects`,
  description:
    "Explore Maria Adriana's full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.",
  alternates: {
    canonical: `${BASE_URL}${ROUTES.projects}`,
  },
})
