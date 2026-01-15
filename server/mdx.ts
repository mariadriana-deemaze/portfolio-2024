import { compile, run } from '@mdx-js/mdx'
import React from 'react'
import * as runtime from 'react/jsx-runtime'
import { renderToString } from 'react-dom/server'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'

export async function renderMdxToHtml(source: string): Promise<string> {
  const compiled = await compile(source, {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkToc, { tight: true, maxDepth: 5 }],
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [rehypePrettyCode, { theme: 'github-dark-high-contrast' }],
    ],
    development: false,
    outputFormat: 'function-body',
    format: 'mdx',
  })

  const mod = await run(compiled, { ...runtime, Fragment: React.Fragment })
  const MDXContent = mod.default as React.ComponentType<any>

  const html = renderToString(
    React.createElement(MDXContent, {
      components: {
        Image: props => React.createElement('img', props),
        pre: props => React.createElement('pre', props),
      },
    })
  )
  return html
}
