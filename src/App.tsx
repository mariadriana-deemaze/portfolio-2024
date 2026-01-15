import { routeTree } from '@/routeTree.gen'
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { JSX } from 'react'

type CommandLink = { url: string; title: string; type: 'internal' | 'blog' | 'projects' | 'social' }
type InitialData = { message?: string; commandLinks?: CommandLink[] } | undefined

export interface AppProps {
  initialData?: InitialData
  location?: string
}

export default function App(props: AppProps = {}): JSX.Element {
  const router = createRouter({
    routeTree,
    context: { initialData: props.initialData },
    ...(props.location
      ? { history: createMemoryHistory({ initialEntries: [props.location] }) }
      : {}),
  })

  return <RouterProvider router={router} />
}
