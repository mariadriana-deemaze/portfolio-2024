/// <reference types="vite/client" />

import { createClient, type SanityClient } from '@sanity/client'
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

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {}
const nodeEnv = typeof process !== 'undefined' ? process.env : {}
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

let cachedClient: SanityClient | null = null

export function getSanityClient() {
  if (cachedClient) {
    return cachedClient
  }

  if (isStudioRuntime) {
    throw new Error('Sanity client should only be initialized for the website runtime.')
  }

  const env = sanityEnvSchema.parse(readEnv())
  cachedClient = createClient(env)
  return cachedClient
}
