import express, { type Request, type Response, type NextFunction } from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import http from 'node:http'
import type { Seo } from './server/types'
import { matchRoute } from './server/routes'
import apiRouter from './server/routes/api'

dotenv.config()

const PORT = Number(process.env.PORT || 3000)
const USE_HMR = process.argv.includes('--hmr') || process.env.SSR_HMR === '1' || process.env.NODE_ENV === 'development'

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
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
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
  )
  return html
}

async function start() {
  if (USE_HMR) {
    const app = express()
    const httpServer = http.createServer(app)
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: 'custom',
      logLevel: 'info',
    })

    app.use(express.json())
    app.use('/api', apiRouter)
    app.use(vite.middlewares)

    async function handleRender(req: Request, res: Response, status = 200) {
      try {
        const templatePath = path.resolve('index.html')
        const rawTemplate = await fs.promises.readFile(templatePath, 'utf-8')
        const template = await vite.transformIndexHtml(req.originalUrl, rawTemplate)

        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
        const route = matchRoute(req)
        const props = route.getProps({ url: req.url })
        const appHtml = render(props)
        const seo = route.getSeo({ path: req.path, url: req.url })
        const html = assembleHtml(template, appHtml, props, seo)
        res.status(status).setHeader('Content-Type', 'text/html').end(html)
      } catch (e: any) {
        vite.ssrFixStacktrace(e)
        console.error(e)
        res.status(500).end(e?.message || 'SSR render error')
      }
    }

    app.get(['/', '/work', '/about', '/blog'], (req, res) => handleRender(req, res))
    app.get(/.*/, (req, res) => handleRender(req, res, 404))

    httpServer.listen(PORT, () => {
      console.log(`Dev SSR + HMR running at http://localhost:${PORT}`)
    })
    return
  }

  // Production server (prebuilt client + SSR bundle)
  const app = express()
  const { render } = await import('./dist-ssr/entry-server.js')
  app.use(express.json())
  app.use('/api', apiRouter)

  app.get(['/', '/work', '/about', '/blog'], (req: Request, res: Response, _next: NextFunction) => {
    const htmlFilePath = path.resolve('dist/index.html')
    fs.readFile(htmlFilePath, 'utf-8', (err, template) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Some error happened')
      }
      const route = matchRoute(req)
      const props = route.getProps({ url: req.url })
      const appHtml = render(props)
      const seo = route.getSeo({ path: req.path, url: req.url })
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
      const route = matchRoute(req)
      const props = route.getProps({ url: req.url })
      const appHtml = render(props)
      const seo = route.getSeo({ path: req.path, url: req.url })
      const finalHtml = assembleHtml(template, appHtml, props, seo)
      return res.status(404).send(finalHtml)
    })
  })

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
