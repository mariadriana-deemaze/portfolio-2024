import type { Request } from 'express'
import type { RouteModule } from '../types'
import home from './home'
import work from './work'
import workItem from './work_item'
import about from './about'
import blog from './blog'
import blogItem from './blog_item'
import notfound from './notfound'

export const routes: RouteModule[] = [home, workItem, work, about, blogItem, blog]

export function matchRoute(req: Request): RouteModule {
  for (const r of routes) {
    if (typeof r.path === 'string') {
      if (req.path === r.path) return r
    } else {
      if (r.path.test(req.path)) return r
    }
  }
  return notfound
}
