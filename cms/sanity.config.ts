import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemaTypes'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "";

export default defineConfig({
  name: 'default',
  title: 'Portfolio Blog',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
