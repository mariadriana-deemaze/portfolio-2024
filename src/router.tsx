import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'

function createAppRouter() {
  const queryClient = new QueryClient()

  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    notFoundMode: 'root',
    scrollRestoration: true,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
}

let clientRouter: ReturnType<typeof createAppRouter> | undefined

export function getRouter() {
  if (typeof document !== 'undefined') {
    clientRouter ??= createAppRouter()
    return clientRouter
  }

  return createAppRouter()
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
