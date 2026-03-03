import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { publicEnvSchema } from '../src/lib/env'
import { schemaTypes } from './schemaTypes'

const env = publicEnvSchema.parse(process.env)

export default defineConfig({
  name: 'default',
  title: 'Portfolio Blog',
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
