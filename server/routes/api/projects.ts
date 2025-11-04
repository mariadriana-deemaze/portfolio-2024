import { Router, type Request, type Response } from 'express'
import { getProjects } from '../../..//src/data/projects'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await getProjects()
    return res.status(200).json({ data: projects })
  } catch (e) {
    console.error('Failed to load projects', e)
    return res.status(500).json({ data: [] })
  }
})

export default router

