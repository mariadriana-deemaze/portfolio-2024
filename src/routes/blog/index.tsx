import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { getPostsClient } from '@/data/blog/client'
import type { BlogPost } from '@/data/blog'
import PostsList from '@/components/pages/blog/posts-list'

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
