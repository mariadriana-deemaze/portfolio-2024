import type { RouteModule } from '../types'
import { getProjects, type Project } from '../../src/data/projects'
import { data } from '@/data/main'

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
    title: `${data.name} | ${data.role}`,
    description:
      'Maria Adriana is a full stack developer based in Portugal, specializing in modern web technologies including Node.js, NestJS, Next.js, TypeScript, and React. Passionate about building scalable, maintainable, and high-performance applications.',
    /*  alternates: {
       canonical: 'https://maria-adriana.com/'
     } */
  })
}

export default homeRoute
