export const sanityI18n = {
  string: 'internationalizedArrayString',
  text: 'internationalizedArrayText',
  body: 'internationalizedArrayBody'
} as const

type I18nArray = Array<{_key: string; value?: string}>

export function resolveI18nPreview(value: unknown, fallback = ''): string {
  if (Array.isArray(value)) {
    return (value as I18nArray).find((t) => t._key === 'en')?.value ?? fallback
  }
  return (value as string) ?? fallback
}

export function resolveI18nSlugSource(fieldName: string) {
  return (doc: Record<string, unknown>) => {
    const field = doc[fieldName] as I18nArray | undefined
    return field?.find((t) => t._key === 'en')?.value ?? ''
  }
}
