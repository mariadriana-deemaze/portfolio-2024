import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {publicEnvSchema} from '../src/lib/env'
import {schemaTypes} from './schemaTypes'

const env = publicEnvSchema.parse({
  VITE_SANITY_PROJECT_ID: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  VITE_SANITY_DATASET: import.meta.env.SANITY_STUDIO_DATASET,
  VITE_SANITY_API_VERSION: import.meta.env.SANITY_STUDIO_API_VERSION,
  VITE_SANITY_USE_CDN: import.meta.env.VITE_SANITY_USE_CDN
})

export default defineConfig({
  name: 'default',
  title: 'Portfolio Blog',
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
})
