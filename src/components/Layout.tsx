import { JSX } from 'react'
import { CommandMenu } from '@/components/command-menu'
import { BGGrid } from '@/components/bg-grid'
import ProgressIndicator from '@/components/progress-indicator'
import { Navbar } from '@/components/navbar'
import { GoogleAnalytics } from '@/components/google-analytics'
import '../styles/globals.css'

export type CommandLink = { url: string; title: string; type: 'internal' | 'blog' | 'projects' | 'social' }

export interface LayoutProps {
  children: JSX.Element | JSX.Element[] | null
  commandLinks?: CommandLink[]
}

export default function Layout({ children, commandLinks = [] }: LayoutProps): JSX.Element {
  return (
    <div className="max-w-full overflow-y-scroll overflow-x-hidden no-scrollbar antialiased mb-10 lg:mx-auto">
      <GoogleAnalytics />
      <Navbar />
      <ProgressIndicator />
      <main className="container relative mx-auto mt-28 overflow-auto print:p-12 overflow-y-scroll overflow-x-hidden no-scrollbar">
        <BGGrid>{children}</BGGrid>
        <CommandMenu links={commandLinks} />
      </main>
    </div>
  )
}
