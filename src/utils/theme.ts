type ThemePreference = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme'

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'

function resolveTheme(theme: ThemePreference): 'light' | 'dark' {
  if (!isBrowser()) {
    return 'light'
  }
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function persistTheme(theme: ThemePreference) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function applyTheme(theme: ThemePreference, { persist = true } = {}) {
  if (!isBrowser()) {
    return
  }
  const resolvedTheme = resolveTheme(theme)
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  if (persist) {
    persistTheme(theme)
  }
}

export function initThemeFromStorage() {
  if (!isBrowser()) {
    return
  }

  const storedTheme = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null)
    : null) ?? 'system'

  applyTheme(storedTheme, { persist: false })
}
