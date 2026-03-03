import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const { generateSitemapXml } = await import('@/server/site-data')
        const xml = await generateSitemapXml()

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
          },
        })
      },
    },
  },
})
