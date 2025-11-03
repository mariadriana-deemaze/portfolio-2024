import { Router } from 'express'
import sendRouter from './send'
import spotifyRouter from './spotify'

const api = Router()

api.use('/send', sendRouter)
api.use('/spotify', spotifyRouter)

export default api

