import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { JSX, isValidElement } from 'react'
import { Badge } from '@/components/ui/badge'
import { data } from '@/data/main'
import { STACKS } from '@/components/stacks'
import "@/styles/projects/index.css"

export const Route = createFileRoute('/work/$slug')({
  component: WorkItemRoute,
})

function WorkItemRoute(): JSX.Element {
  const router = useRouter()
  const project = router.options.context.initialData?.project
  const html = router.options.context.initialData.projectHtml

  if (!project) {
    return (
      <div>
        <h1>Project not found</h1>
        <p>The requested project could not be located.</p>
        <p>
          <a href="/work">Back to projects</a>
        </p>
      </div>
    )
  }

  const { title, year, description, hero, technologies = [], repo, liveUrl } = project

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="font-mono text-sm text-gray-500">
        <a href="/work" className="hover:underline">
          &larr; Back to projects
        </a>
      </p>
      <header className="space-y-2">
        <time className="font-mono text-xs text-gray-500">YEAR {year}</time>
        <h1 className="font-clash font-bold text-5xl text-fade-grad">{title}</h1>
        <p className="font-mono text-sm text-foreground">{description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {technologies.map(({ label, icon }) => {
            const resolvedIcon = isValidElement(icon) ? icon : Object.values(STACKS).find((t) => t.label === label)?.icon ?? null;
            return (
              <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline" key={label}>
                {resolvedIcon}
                <span>{label}</span>
              </Badge>
            )
          })}
        </div>
        <hr className="mt-2" />
      </header>
      <section className="summary flex gap-1 flex-row-reverse">
        <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline">
          <a className="flex flex-row gap-2" href={repo ? `${data.github}/${repo}` : '#'} target="_blank" rel="noreferrer">
            View repo
          </a>
        </Badge>
        {liveUrl && (
          <Badge className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default" variant="outline">
            <a className="flex flex-row gap-2" href={liveUrl} target="_blank" rel="noreferrer">
              Live demo
            </a>
          </Badge>
        )}
      </section>
      {hero && (
        <img className="border border-gray-400/30 dark:border-gray-200/10 self-center rounded-md" alt={`Hero image of the ${title} project.`} width={800} height={400} src={hero} />
      )}
      <article className="content mt-4">
        <div className="prose font-mono dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  )
}
