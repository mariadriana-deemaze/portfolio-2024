import ProjectsList from '@/components/pages/projects';
import { data } from '@/data/main';
import { getProjects } from '@/data/projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: Projects`,
	description: 'My personal blog, for rambles and so on → ' + data.summary,
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
