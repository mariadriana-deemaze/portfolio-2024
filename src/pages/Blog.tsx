import { JSX } from 'react'
import { Link } from 'react-router-dom'
import { type BlogPost } from '@/data/blog'
import { Badge } from '@/components/ui/badge'

export default function Blog({ posts = [] }: { posts?: BlogPost[] }): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="font-clash font-bold text-5xl">Blog</h1>
        <h4 className="font-clash font-medium text-md text-gray-500">Articles list</h4>
      </header>
      <section>
        {posts.length === 0 && (
          <p className="font-mono text-sm text-foreground text-center">
            Looks empty here - enter the void
          </p>
        )}
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
            <li key={`blogpost-${post.slug}`} className="border-b pb-6">
              <article>
                <h2 className="font-clash text-2xl">
                  <a href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </a>
                </h2>
                <p className="mt-2 font-mono text-sm text-foreground">
                  {post.description}
                </p>
                {post.keywords?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.keywords.map((k) => (
                      <Badge key={`${post.slug}-${k}`} variant="outline" className="py-1 px-3 text-[10px]">
                        <span>{k}</span>
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
