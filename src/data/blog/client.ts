import type { BlogPost } from '@/data/blog';

import { getPosts } from '@/data/blog';

export async function getPostsClient(): Promise<BlogPost[]> {
  return getPosts();
}


