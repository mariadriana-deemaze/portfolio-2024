import { Router } from 'express'
import sendRouter from '@/server/routes/api/send'
import spotifyRouter from '@/server/routes/api/spotify'
import projectsRouter from '@/server/routes/api/projects'

const api = Router()

api.use('/send', sendRouter)
api.use('/spotify', spotifyRouter)
api.use('/projects', projectsRouter)

export default api
