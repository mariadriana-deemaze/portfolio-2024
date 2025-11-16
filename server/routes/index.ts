import type { Request } from 'express'
import type { RouteModule } from '../types'
import home from './home'
import work from './work'
import workItem from './work_item'
import blog from './blog'
import blogItem from './blog_item'
import notfound from './notfound'

export const routes: RouteModule[] = [home, workItem, work, blogItem, blog]

export function matchRoute(req: Request): RouteModule {
  for (const route of routes) {
    if (typeof route.path === 'string') {
      if (req.path === route.path) return route
    } else {
      if (route.path.test(req.path)) return route
    }
  }
  return notfound
}
