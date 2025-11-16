import { Router } from 'express'
import sendRouter from './send'
import spotifyRouter from './spotify'
import projectsRouter from './projects'

const api = Router()

api.use('/send', sendRouter)
api.use('/spotify', spotifyRouter)
api.use('/projects', projectsRouter)

export default api
