import express, { type Request, type Response, type NextFunction } from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3000

const { render } = await import('./dist-ssr/entry-server.js')

function serializeProps(props: object): string {
  return JSON.stringify(props)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

type Seo = { title: string; description: string; image: string }

function seoForPath(pathname: string): Seo {
  switch (pathname) {
    case '/':
      return {
        title: 'Home | Portfolio',
        description: 'Welcome to my portfolio homepage.',
        image: 'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
      }
    case '/work':
      return {
        title: 'Work | Portfolio',
        description: 'Selected projects and professional work.',
        image: 'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
      }
    case '/about':
      return {
        title: 'About | Portfolio',
        description: 'About me and this site.',
        image: 'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
      }
    case '/blog':
      return {
        title: 'Blog | Portfolio',
        description: 'Thoughts, writing, and updates.',
        image: 'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
      }
    default:
      return {
        title: '404 | Page Not Found',
        description: 'The page you requested could not be found.',
        image: 'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
      }
  }
}

function assembleHtml(template: string, appHtml: string, props: object, seo: Seo): string {
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
  const metas = [
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
  ].join('\n    ')
  html = html.replace('</head>', `  ${metas}\n  </head>`)
  
  const serialized = serializeProps(props)
  html = html.replace(
    '<script type="module"',
    `<script>window.__INITIAL_PROPS__=${serialized}</script><script type="module"`
  );
  
  return html
}

app.get(['/', '/work', '/about', '/blog'], (req: Request, res: Response, _next: NextFunction) => {
  const htmlFilePath = path.resolve('dist/index.html')
  fs.readFile(htmlFilePath, 'utf-8', (err, template) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Some error happened')
    }
    const initialData = req.path === '/about' ? { message: 'Hello world' } : undefined
    const props = { location: req.url, initialData }
    const appHtml = render(props)
    const seo = seoForPath(req.path)
    const finalHtml = assembleHtml(template, appHtml, props, seo)

    return res.send(finalHtml)
  })
})

app.use(express.static('dist'))

app.get(/.*/, (req: Request, res: Response) => {
  const htmlFilePath = path.resolve('dist/index.html')
  fs.readFile(htmlFilePath, 'utf-8', (err, template) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Some error happened')
    }
    const props = { location: req.url }
    const appHtml = render(props)
    const seo = seoForPath(req.path)
    const finalHtml = assembleHtml(template, appHtml, props, seo)
    return res.status(404).send(finalHtml)
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
