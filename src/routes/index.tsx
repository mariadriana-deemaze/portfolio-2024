import { createFileRoute } from '@tanstack/react-router'

import { HomeLayout } from '@/components/pages/home/layout'
import { SeoMetadata } from '@/data/routes/index'
import { createSeoHead } from '@/lib/head'
import { getProjectsFn } from '@/server-fns/content'

export const Route = createFileRoute('/')({
  loader: async () => {
    const projects = await getProjectsFn()

    return {
      projects,
    }
  },
  head: () => createSeoHead(SeoMetadata()),
  component: HomeRoute,
})

function HomeRoute() {
  const { projects } = Route.useLoaderData()

  return <HomeLayout projects={projects} />
}
