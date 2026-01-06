/// <reference types="vite/client" />


import matter from 'gray-matter';
import type { BlogPost, BlogPostRaw } from './index';

export async function getPostsClient(): Promise<BlogPost[]> {
  const modules = import.meta.glob('/src/data/blog/*.md', { query: "?raw", import: "default" });

  const entries = Object.entries(modules) as [string, () => Promise<string>][];

  const posts: (BlogPost | null)[] = await Promise.all(
    entries.map(async ([, loader]) => {
      const raw = await loader();

      const { data, content } = matter(raw) as unknown as { data: BlogPostRaw; content: string };

      if (data?.published === false) return null;

      const post: BlogPost = {
        ...data,
        keywords: Array.isArray(data?.keywords) ? (data.keywords).map((w) => `#${w}`) : [],
        external_link: data?.link,
        body: content,
      };
      return post;
    })
  );

  return posts
    .filter((p): p is BlogPost => !!p)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


