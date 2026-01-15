
import { STACKS } from '@/components/stacks';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'path';
import { JSX } from 'react';

const PROJECTS_DIR = './src/data/projects';

export interface ProjectRaw {
	hero: string;
	title: string;
	description: string;
	year: string;
	slug: string;
	repo: string;
	medium: string;
	tags: string[];
	colors: string[];
	technologies: string[];
}

export interface Project {
	hero: string;
	title: string;
	description: string;
	medium: string;
	tags: string[];
	colors: string[];
	year: string;
	slug: string;
	content: string;
	technologies: {
		label: string;
		icon: JSX.Element;
	}[];
	repo: string;
	liveUrl?: string;
}

export const getProjects = async () => {
	const content = await fs.readdir(PROJECTS_DIR);

	const projects = await Promise.all(
		content
			.filter((file) => path.extname(file) === '.mdx')
			.map(async (file) => {
				const filePath = `${PROJECTS_DIR}/${file}`;
				const projectContent = await fs.readFile(filePath, 'utf8');

				const { data, content } = matter(projectContent) as unknown as { data: ProjectRaw, content: string };

				const project: Project = {
					...data,
					technologies: data.technologies.map((technology) => STACKS[technology]),
					content
				};
				return project;
			})
	);

	return projects
		.filter((project) => project !== null)
		.sort((a, b) =>
			a && b ? new Date(b.year).getTime() - new Date(a.year).getTime() : 0
		) as Project[];
};

export async function getProject(slug: string) {
	const projects = await getProjects();
	return projects.find((project) => project.slug === slug);
}

