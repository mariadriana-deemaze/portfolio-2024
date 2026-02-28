import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { BASE_URL } from '@/data/main'
import { createSeoHead } from '@/lib/head'
import { getPostFn } from '@/server-fns/content'
import { ROUTES } from '@/utils/routes'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const postData = await getPostFn({ data: { slug: params.slug } })

    if (!postData.post) {
      throw notFound()
    }

    return {
      post: postData.post,
      postHtml: postData.postHtml ?? '',
    }
  },
  head: ({ loaderData, params }) =>
    createSeoHead({
      title: `${loaderData?.post?.title ?? 'Not found'} | Blog`,
      description:
        loaderData?.post?.description ?? 'The requested blog post could not be located.',
      alternates: {
        canonical: `${BASE_URL}/blog/${params.slug}`,
      },
    }),
  component: BlogShowRoute,
  notFoundComponent: BlogPostNotFoundRoute,
})

function BlogShowRoute() {
  const { post, postHtml } = Route.useLoaderData()
  const { title, description, keywords = [] } = post

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="font-mono text-sm text-gray-500">
        <Link to={ROUTES.blog} className="hover:underline">
          &larr; Back to blog
        </Link>
      </p>
      <header className="space-y-2">
        <h1 className="font-clash text-3xl">{title}</h1>
        <p className="font-mono text-sm text-foreground">{description}</p>
        {keywords.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {keywords.map((label: string) => (
              <Badge
                key={`${post.slug}-${label}`}
                className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default"
                variant="outline"
              >
                <span>{label}</span>
              </Badge>
            ))}
          </div>
        ) : null}
      </header>
      <article className="content mt-4">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: postHtml }}
        />
      </article>
    </div>
  )
}

function BlogPostNotFoundRoute() {
  return (
    <div>
      <h1>Post not found</h1>
      <p>The requested blog post could not be located.</p>
      <p>
        <Link to={ROUTES.blog}>Back to blog</Link>
      </p>
    </div>
  )
}
