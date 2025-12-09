import { JSX, useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { CommandMenu } from './command-menu'
import { BGGrid } from './bg-grid'
import ProgressIndicator from './progress-indicator'
import { Navbar } from './navbar'
import '../styles/globals.css'
import '../styles/blog/index.css'

const GA_TRACKING_ID = 'G-ZSZBWDZK9T'
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type CommandLink = { url: string; title: string; type: 'internal' | 'blog' | 'projects' | 'social' }

export interface LayoutProps {
  children: JSX.Element | JSX.Element[] | null
  commandLinks?: CommandLink[]
}

export default function Layout({ children, commandLinks = [] }: LayoutProps): JSX.Element {
  return (
    <div className="max-w-full overflow-y-scroll overflow-x-hidden no-scrollbar antialiased mb-10 lg:mx-auto">
      <Analytics />
      <Navbar />
      <ProgressIndicator />
      <main className="container relative mx-auto mt-28 overflow-auto print:p-12 overflow-y-scroll overflow-x-hidden no-scrollbar">
        <BGGrid>{children}</BGGrid>
        <CommandMenu links={commandLinks} />
      </main>
    </div>
  )
}

function Analytics(): JSX.Element | null {
  const location = useRouterState({ select: (state) => state.location })
  const pagePath = location.href ?? location.pathname

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!document.querySelector(`script[data-analytics="${GA_TRACKING_ID}"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.src = GA_SCRIPT_SRC
      script.dataset.analytics = GA_TRACKING_ID
      document.head.appendChild(script)
    }

    window.dataLayer = window.dataLayer ?? []
    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }

    window.gtag('js', new Date())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }

    window.gtag('config', GA_TRACKING_ID, { page_path: pagePath })
  }, [pagePath])

  return null
}
