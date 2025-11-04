import type { RouteModule } from '../types'
import { getProjects, type Project } from '../../src/data/projects'

type HomeData = { projects: Project[] }

const homeRoute: RouteModule<HomeData> = {
  path: '/',
  getProps: (req) => ({ location: req.url }),
  async getInitialData() {
    try {
      const projects = await getProjects()
      return { projects }
    } catch (e) {
      console.error('Failed to load home projects', e)
      return { projects: [] }
    }
  },
  getSeo: (_ctx) => ({
    title: 'Home | Portfolio',
    description: 'Welcome to my portfolio homepage.',
    image:
      'https://fastly.picsum.photos/id/705/800/1000.jpg?hmac=B4yaMDEw4yUnMYwvwKGpCz61k9acVLaWj2XoM83Ycm8',
  }),
}

export default homeRoute
