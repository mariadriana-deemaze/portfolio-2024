import { getProjects } from '@/data/projects'
import { Router, type Request, type Response } from 'express'

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
