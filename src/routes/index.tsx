import { createFileRoute, useRouter } from '@tanstack/react-router'
import { HomeLayout } from '@/components/pages/home/layout'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const router = useRouter()
  const projects = router.options.context.initialData.projects ?? []
  return <HomeLayout projects={projects} />
}
