import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import type { RouteModule } from '../../../server/types'
import { getPost, type BlogPost } from '@/data/blog'
import { renderMdxToHtml } from '../../../server/mdx'
import { BASE_URL } from '@/data/main'

const notFoundRoute: RouteModule = {
  path: /.*/,
  getProps: (req) => ({ location: req.url }),
  getSeo: () => ({
    title: `Not found`,
    description: 'The requested blog post could not be located.',
  }),
};

export const Route = createFileRoute('/blog/$slug')({
  component: BlogShowRoute,
})

type BlogItemData = { post?: BlogPost; postHtml?: string }

export const getServerSideProps: RouteModule<BlogItemData>['getInitialData'] = async (req) => {
  try {
    const match = /^\/blog\/([^/]+)$/.exec(new URL(req.url, 'http://localhost').pathname)
    const slug = match?.[1]
    if (!slug) return { post: undefined }
    const post = await getPost(slug)
    const postHtml = post?.body ? await renderMdxToHtml(post.body) : undefined
    return { post, postHtml }
  } catch (e) {
    console.error('Failed to load blog post', e)
    return { post: undefined }
  }
}

export const SeoMetadata: RouteModule<BlogItemData>['getSeo'] = async (ctx) => {
  const slug = ctx.path.split('/').pop() || '';
  const post = await getPost(slug);

  if (!post) {
    return notFoundRoute.getSeo(ctx);
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}${ctx.path}`,
    },
  }
}


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
          <a href="/blog">Back to blog</a>
        </p>
      </div>
    )
  }

  const { title, description, keywords = [] } = post

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="font-mono text-sm text-gray-500">
        <a href="/blog" className="hover:underline">
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
