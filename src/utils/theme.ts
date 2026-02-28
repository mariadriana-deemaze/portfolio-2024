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

export function getThemeInitScript(): string {
  return `(() => {
  const storageKey = '${THEME_STORAGE_KEY}';
  let theme = 'system';

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      theme = storedTheme;
    }
  } catch {}

  const resolvedTheme =
    theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : theme === 'system'
        ? 'light'
        : theme;

  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
})();`
}
