import { JSX } from 'react'
import { HomeLayout } from '../components/pages/home/layout'
import { Project } from '../data/projects'

export default function Home({ projects = [] }: { projects?: Project[] }): JSX.Element {
  return <HomeLayout projects={projects} />
}
