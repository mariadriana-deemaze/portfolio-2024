/**
 * One-time migration: wraps flat Sanity field values as internationalized arrays.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx cms/scripts/migrate-i18n.ts [--dry-run]
 *
 * Run AFTER deploying the triple-fallback GROQ frontend and BEFORE deploying the updated Studio.
 */

const PROJECT_ID = 'bgyzf7si'
const DATASET = 'production'
const API_VERSION = '2025-01-01'

const TOKEN = process.env.SANITY_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN environment variable.')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`

// ── Internationalized array value types ──────────────────────────────

interface LocaleEntry {
  _key: string
  _type: string
  value: unknown
}

function wrapString(value: unknown): LocaleEntry[] {
  return [{_key: 'en', _type: 'internationalizedArrayStringValue', value}]
}

function wrapText(value: unknown): LocaleEntry[] {
  return [{_key: 'en', _type: 'internationalizedArrayTextValue', value}]
}

function wrapBody(value: unknown): LocaleEntry[] {
  return [{_key: 'en', _type: 'internationalizedArrayBodyValue', value}]
}

// ── Field definitions per document type ──────────────────────────────

interface FieldDef {
  path: string
  wrap: (v: unknown) => LocaleEntry[]
}

const PROJECT_FIELDS: FieldDef[] = [
  {path: 'title', wrap: wrapString},
  {path: 'description', wrap: wrapText},
  {path: 'medium', wrap: wrapString},
  {path: 'role', wrap: wrapString},
  {path: 'timeline', wrap: wrapString},
  {path: 'context', wrap: wrapString},
  {path: 'overview', wrap: wrapText},
  {path: 'problem', wrap: wrapText},
  {path: 'approach', wrap: wrapText},
  {path: 'structuredBody', wrap: wrapBody},
  {path: 'seo.title', wrap: wrapString},
  {path: 'seo.description', wrap: wrapText}
]

const POST_FIELDS: FieldDef[] = [
  {path: 'title', wrap: wrapString},
  {path: 'description', wrap: wrapText},
  {path: 'structuredBody', wrap: wrapBody},
  {path: 'seo.title', wrap: wrapString},
  {path: 'seo.description', wrap: wrapText}
]

const RICH_IMAGE_FIELDS: FieldDef[] = [
  {path: 'alt', wrap: wrapString},
  {path: 'caption', wrap: wrapString}
]

const METRIC_FIELDS: FieldDef[] = [{path: 'label', wrap: wrapString}]

// ── Helpers ──────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

function isAlreadyWrapped(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0 && typeof value[0]?._key === 'string'
}

function buildPatches(doc: Record<string, unknown>, fields: FieldDef[]): Record<string, unknown> {
  const set: Record<string, unknown> = {}

  for (const {path, wrap} of fields) {
    const value = getNestedValue(doc, path)
    if (value == null) continue
    if (isAlreadyWrapped(value)) continue
    set[path] = wrap(value)
  }

  return set
}

function buildRichImagePatches(
  doc: Record<string, unknown>,
  imageField: string
): Record<string, unknown> {
  const set: Record<string, unknown> = {}
  const image = doc[imageField] as Record<string, unknown> | undefined
  if (!image) return set

  for (const {path, wrap} of RICH_IMAGE_FIELDS) {
    const value = image[path]
    if (value == null) continue
    if (isAlreadyWrapped(value)) continue
    set[`${imageField}.${path}`] = wrap(value)
  }

  return set
}

function buildArrayItemPatches(
  doc: Record<string, unknown>,
  arrayField: string,
  subFields: FieldDef[],
  subImageField?: string
): Record<string, unknown> {
  const set: Record<string, unknown> = {}
  const items = doc[arrayField] as Array<Record<string, unknown>> | undefined
  if (!Array.isArray(items)) return set

  for (const item of items) {
    const key = item._key as string
    if (!key) continue

    for (const {path, wrap} of subFields) {
      const value = item[path]
      if (value == null) continue
      if (isAlreadyWrapped(value)) continue
      set[`${arrayField}[_key=="${key}"].${path}`] = wrap(value)
    }

    if (subImageField) {
      const image = item[subImageField] as Record<string, unknown> | undefined
      if (!image) continue
      for (const {path, wrap} of RICH_IMAGE_FIELDS) {
        const value = image[path]
        if (value == null) continue
        if (isAlreadyWrapped(value)) continue
        set[`${arrayField}[_key=="${key}"].${subImageField}.${path}`] = wrap(value)
      }
    }
  }

  return set
}

// ── Sanity API ───────────────────────────────────────────────────────

async function fetchDocuments(type: string): Promise<Record<string, unknown>[]> {
  const query = `*[_type == "${type}"]`
  const url = `${BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`}
  })

  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as {result: Record<string, unknown>[]}
  return data.result
}

interface Mutation {
  patch: {id: string; set: Record<string, unknown>}
}

async function applyMutations(mutations: Mutation[]): Promise<void> {
  const url = `${BASE}/data/mutate/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({mutations})
  })

  if (!res.ok) throw new Error(`Mutation failed: ${res.status} ${await res.text()}`)
  const result = await res.json()
  console.log(`Applied ${mutations.length} patches.`, result)
}

// ── Main ─────────────────────────────────────────────────────────────

async function migrate() {
  const mutations: Mutation[] = []

  const projects = await fetchDocuments('project')
  console.log(`Found ${projects.length} projects.`)

  for (const doc of projects) {
    const id = doc._id as string
    const set = {
      ...buildPatches(doc, PROJECT_FIELDS),
      ...buildRichImagePatches(doc, 'coverImage'),
      ...buildArrayItemPatches(doc, 'statistics', METRIC_FIELDS),
      ...buildArrayItemPatches(doc, 'gallery', [], 'image')
    }

    if (Object.keys(set).length > 0) {
      mutations.push({patch: {id, set}})
      console.log(`  ${doc.title ?? id}: ${Object.keys(set).length} field(s) to wrap`)
    }
  }

  const posts = await fetchDocuments('post')
  console.log(`Found ${posts.length} posts.`)

  for (const doc of posts) {
    const id = doc._id as string
    const set = {
      ...buildPatches(doc, POST_FIELDS),
      ...buildRichImagePatches(doc, 'coverImage')
    }

    if (Object.keys(set).length > 0) {
      mutations.push({patch: {id, set}})
      console.log(`  ${doc.title ?? id}: ${Object.keys(set).length} field(s) to wrap`)
    }
  }

  if (mutations.length === 0) {
    console.log('Nothing to migrate — all fields already wrapped.')
    return
  }

  console.log(`\nTotal: ${mutations.length} document(s) to patch.`)

  if (DRY_RUN) {
    console.log('[DRY RUN] No changes applied.')
    console.log(JSON.stringify(mutations, null, 2))
    return
  }

  await applyMutations(mutations)
  console.log('Migration complete.')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
