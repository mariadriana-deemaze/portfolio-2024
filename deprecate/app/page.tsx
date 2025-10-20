import { HomeLayout } from '@/components/pages/home/layout';
import { data } from '@/data/main';
import { getProjects } from '@/data/projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role}`,
	description:
		'Maria Adriana is a full stack developer based in Portugal, specializing in modern web technologies including Node.js, NestJS, Next.js, TypeScript, and React. Passionate about building scalable, maintainable, and high-performance applications.',
	alternates: {
		canonical: 'https://maria-adriana.com/'
	}
};

export default async function Page() {
	const projects = await getProjects();
	return <HomeLayout projects={projects} />;
}
