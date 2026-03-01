import { z } from 'zod'

type SanityEnv = {
  projectId?: string
  dataset?: string
  apiVersion?: string
  useCdn?: string | boolean
}

const sanityEnvSchema = z.object({
  projectId: z.string().min(1),
  dataset: z.string().min(1),
  apiVersion: z.string().min(1),
  useCdn: z.preprocess((value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() !== 'false'
    }
    if (typeof value === 'boolean') {
      return value
    }
    return undefined
  }, z.boolean().default(true)),
})

const sanityQueryResponseSchema = z.object({
  result: z.unknown(),
})

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {}
const nodeEnv =
  typeof globalThis !== 'undefined' && 'process' in globalThis
    ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
    : {}
const isStudioRuntime = Boolean(
  metaEnv.SANITY_STUDIO_PROJECT_ID ||
    metaEnv.SANITY_STUDIO_DATASET ||
    nodeEnv.SANITY_STUDIO_PROJECT_ID ||
    nodeEnv.SANITY_STUDIO_DATASET
)

function readEnv(): SanityEnv {
  const projectId = nodeEnv.VITE_SANITY_PROJECT_ID ?? metaEnv.VITE_SANITY_PROJECT_ID
  const dataset = nodeEnv.VITE_SANITY_DATASET ?? metaEnv.VITE_SANITY_DATASET
  const apiVersion = nodeEnv.VITE_SANITY_API_VERSION ?? metaEnv.VITE_SANITY_API_VERSION
  const useCdnRaw = nodeEnv.VITE_SANITY_USE_CDN ?? metaEnv.VITE_SANITY_USE_CDN
  return { projectId, dataset, apiVersion, useCdn: useCdnRaw }
}

function getSanityConfig() {
  if (isStudioRuntime) throw new Error('Sanity client should only be initialized for the website runtime.')
  return sanityEnvSchema.parse(readEnv())
}

export async function fetchSanityQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const config = getSanityConfig()
  const host = config.useCdn ? 'apicdn.sanity.io' : 'api.sanity.io'
  const url = new URL(
    `https://${config.projectId}.${host}/v${config.apiVersion}/data/query/${config.dataset}`,
  )

  url.searchParams.set('query', query)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Sanity request failed with status ${response.status}`)
  }

  const payload = sanityQueryResponseSchema.parse(await response.json())

  return payload.result as T
}
