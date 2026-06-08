import {z} from 'zod'

export const publicEnvSchema = z.object({
  VITE_SANITY_PROJECT_ID: z.string().trim().min(1),
  VITE_SANITY_DATASET: z.string().trim().min(1),
  VITE_SANITY_API_VERSION: z.string().trim().min(1),
  VITE_SANITY_USE_CDN: z.string().trim().default('true')
})
