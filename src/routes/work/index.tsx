import { createFileRoute, useRouter } from '@tanstack/react-router'
import ProjectsList from '@/components/pages/projects'
import type { RouteModule } from '../../../server/types'
import { getProjects, type Project } from '@/data/projects'
import { data, BASE_URL } from '@/data/main'

export const Route = createFileRoute('/work/')({
  component: WorkRoute,
})

function WorkRoute() {
  const router = useRouter()
  const projects = router.options.context.initialData?.projects ?? []
  return <ProjectsList projects={projects} />
}

type WorkData = { projects: Project[] }

export const getServerSideProps: RouteModule<WorkData>['getInitialData'] = async () => {
  try {
    const projects = await getProjects()
    return { projects }
  } catch (e) {
    console.error('Failed to load work projects', e)
    return { projects: [] }
  }
}

export const SeoMetadata: RouteModule<WorkData>['getSeo'] = () => ({
  title: `${data.name} | ${data.role} :: Projects`,
  description:
    "Explore Maria Adriana's full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.",
  alternates: {
    canonical: `${BASE_URL}/work`,
  },
})
