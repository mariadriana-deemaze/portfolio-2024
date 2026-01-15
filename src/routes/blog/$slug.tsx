import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/utils/routes'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogShowRoute,
})

function BlogShowRoute() {
  const router = useRouter()
  const post = router.options.context.initialData?.post
  const html = router.options.context.initialData?.postHtml

  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
        <p>The requested blog post could not be located.</p>
        <p>
          <a href={ROUTES.blog}>Back to blog</a>
        </p>
      </div>
    )
  }

  const { title, description, keywords = [] } = post

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="font-mono text-sm text-gray-500">
        <a href={ROUTES.blog} className="hover:underline">
          &larr; Back to blog
        </a>
      </p>
      <header className="space-y-2">
        <h1 className="font-clash text-3xl">{title}</h1>
        <p className="font-mono text-sm text-foreground">{description}</p>
        {keywords.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {keywords.map((label: string) => (
              <Badge key={`${post.slug}-${label}`} className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline">
                <span>{label}</span>
              </Badge>
            ))}
          </div>
        ) : null}
      </header>
      <article className="content mt-4">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  )
}
