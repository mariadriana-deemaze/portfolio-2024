import { defineCliConfig } from 'sanity/cli'

import { publicEnvSchema } from '../src/lib/env'

const parsedEnv = publicEnvSchema.safeParse(process.env)

const env = parsedEnv.success ? parsedEnv.data : undefined

export default defineCliConfig({
  api: {
    projectId:
      env?.VITE_SANITY_PROJECT_ID,
    dataset: env?.VITE_SANITY_DATASET,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
