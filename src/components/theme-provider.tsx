'use client';

import { JSX, ReactNode } from 'react'

export interface ThemeProviderProps {
  children?: ReactNode
  attribute?: string
  defaultTheme?: 'light' | 'dark' | 'system'
}

// No-op provider placeholder to avoid next-themes dependency during migration
export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  return <>{children}</>
}
