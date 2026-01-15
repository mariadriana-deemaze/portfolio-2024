import type { BlogPost } from '@/data/blog'
import type { RouteModule } from '@/server/types'

import PostsList from '@/components/pages/blog/posts-list'
import { getPosts } from '@/data/blog'
import { getPostsClient } from '@/data/blog/client'
import { data, BASE_URL } from '@/data/main'
import { ROUTES } from '@/utils/routes'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/blog/')({
  component: BlogIndexRoute,
})

function BlogIndexRoute() {
  const router = useRouter()
  const ssrPostsRaw = router.options.context.initialData?.posts
  const ssrPosts = useMemo(() => ssrPostsRaw ?? [], [ssrPostsRaw])
  const [posts, setPosts] = useState<BlogPost[]>(ssrPosts)

  useEffect(() => {
    if (!ssrPosts || ssrPosts.length === 0) {
      getPostsClient()
        .then((data) => setPosts(data))
        .catch(() => setPosts([]))
    }
  }, [ssrPosts])
  return <PostsList posts={posts} />
}

type BlogData = { posts?: BlogPost[] }

export const getServerSideProps: RouteModule<BlogData>['getInitialData'] = async () => {
  try {
    const posts = await getPosts()
    return { posts }
  } catch (e) {
    console.error('Failed to load posts', e)
    return { posts: [] }
  }
}

export const SeoMetadata: RouteModule<BlogData>['getSeo'] = () => ({
  title: `${data.name} | ${data.role} :: Blog`,
  description:
    "Explore Maria Adriana's insights on Full Stack Development, with in-depth articles on problem-solving strategies, architecture decisions, performance optimization, and modern web technologies.",
  alternates: {
    canonical: `${BASE_URL}${ROUTES.blog}`,
  }
})
