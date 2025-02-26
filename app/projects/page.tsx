import ProjectsList from '@/components/pages/projects';
import { data } from '@/data/main';
import { getProjects } from '@/data/projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: Projects`,
	description:
		'Explore Maria Adriana’s full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.',
	alternates: {
		canonical: 'https://maria-adriana.com/projects'
	}
};

export async function generateStaticParams() {
	const projects = await getProjects();
	return projects.map((project) => ({ slug: project.slug }));
}

export default async function Page() {
	const projects = await getProjects();
	return <ProjectsList projects={projects} />;
}
