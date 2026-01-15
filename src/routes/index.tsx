import type { RouteModule } from '@/server/types'

import { HomeLayout } from '@/components/pages/home/layout'
import { data, BASE_URL } from '@/data/main'
import { getProjects, type Project } from '@/data/projects'
import { ROUTES } from '@/utils/routes'
import { createFileRoute, useRouter } from '@tanstack/react-router'

type HomeData = { projects: Project[] }

export const Route = createFileRoute("/")({
  component: HomeRoute,
})

export const getServerSideProps: RouteModule<HomeData>['getInitialData'] = async () => {
  try {
    const projects = await getProjects()
    return { projects }
  } catch (e) {
    console.error('Failed to load home projects', e)
    return { projects: [] }
  }
}

export const SeoMetadata: RouteModule<HomeData>['getSeo'] = () => ({
  title: `${data.name} | ${data.role}`,
  description:
    'Maria Adriana is a full stack developer based in Portugal, specializing in modern web technologies including Node.js, NestJS, Next.js, TypeScript, and React. Passionate about building scalable, maintainable, and high-performance applications.',
  alternates: {
    canonical: `${BASE_URL}${ROUTES.home}`,
  },
})

function HomeRoute() {
  const router = useRouter()
  const projects = router.options.context.initialData.projects ?? []
  return <HomeLayout projects={projects} />
}
