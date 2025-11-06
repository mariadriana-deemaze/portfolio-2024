import { createFileRoute, useRouter } from '@tanstack/react-router'
import ProjectsList from '@/components/pages/projects'

export const Route = createFileRoute('/work/')({
  component: WorkRoute,
})

function WorkRoute() {
  const router = useRouter()
  const projects = (router.options.context as any)?.initialData?.projects ?? []
  return <ProjectsList projects={projects} />
}
