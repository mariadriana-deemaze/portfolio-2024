import { createFileRoute, useRouter } from '@tanstack/react-router'

import ProjectsList from '@/components/pages/projects'

export const Route = createFileRoute('/projects/')({
  component: ProjectRoute,
})

function ProjectRoute() {
  const router = useRouter()
  const projects = router.options.context.initialData?.projects ?? []
  return <ProjectsList projects={projects} />
}

