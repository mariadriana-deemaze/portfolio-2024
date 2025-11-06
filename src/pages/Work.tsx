import { JSX } from 'react'
import ProjectsList from '@/components/pages/projects'
import { type Project } from '@/data/projects'

export default function Work({ projects = [] }: { projects?: Project[] }): JSX.Element {
  return <ProjectsList projects={projects} />
}
