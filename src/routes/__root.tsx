import { Outlet, createRootRouteWithContext, useRouter, Link } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'

type AppContext = {
  initialData?: any
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundRoute,
})

function RootComponent() {
  const router = useRouter()
  const commandLinks = router.options.context.initialData.commandLinks
  return (
    <Layout commandLinks={commandLinks}>
      <Outlet />
    </Layout>
  )
}

function NotFoundRoute() {
  return (
    <div className="mx-auto text-center max-w-[450px] mt-10 flex flex-col items-center justify-center">
      <h2 className="text-fade-grad font-clash text-4xl font-semibold">Not found</h2>
      <p className="mt-4 text-pretty font-mono text-sm text-foreground">
        Whatever you were looking for, is simply not here. <br />
        <i>Have you tried looking under the bed?</i>
      </p>
      <Button variant="outline" size="lg" className="mt-10" asChild>
        <Link to="/">Feeling lucky ✨</Link>
      </Button>
    </div>
  )
}
