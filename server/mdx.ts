import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import React from 'react'
import { renderToString } from 'react-dom/server'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

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
        pre: props => React.createElement('code', props),
      },
    })
  )
  return html
}
