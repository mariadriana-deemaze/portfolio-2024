import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

const GA_TRACKING_ID = 'G-ZSZBWDZK9T'
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
const GA_INLINE_ATTR = 'data-analytics-inline'
const GA_SCRIPT_ATTR = 'data-analytics'

function ensureScript(dataAttr: string, trackingId: string, create: () => HTMLScriptElement): void {
  if (typeof document === 'undefined') {
    return
  }
  if (document.querySelector(`script[${dataAttr}="${trackingId}"]`)) {
    return
  }
  document.head.appendChild(create())
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (..._args: unknown[]) => void
  }
}

export function GoogleAnalytics(): null {
  const location = useRouterState({ select: (state) => state.location })
  const pagePath = location.href ?? location.pathname

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    ensureScript(GA_SCRIPT_ATTR, GA_TRACKING_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = GA_SCRIPT_SRC
      script.dataset.analytics = GA_TRACKING_ID
      return script
    })

    ensureScript(GA_INLINE_ATTR, GA_TRACKING_ID, () => {
      const inlineScript = document.createElement('script')
      inlineScript.dataset.analyticsInline = GA_TRACKING_ID
      inlineScript.text = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
`
      return inlineScript
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }

    window.gtag('config', GA_TRACKING_ID, { page_path: pagePath })
  }, [pagePath])

  return null
}
