"use server"

import fs from 'node:fs/promises';
import path from 'path';
import matter from 'gray-matter';

const PROJECTS_DIR = './data/projects';

export interface Project {
	hero: string;
	title: string;
	description: string;
	date: string;
	slug: string;
	content: string;
}

export const getProjects = async () => {
	const content = await fs.readdir(PROJECTS_DIR);

	const projects = await Promise.all(
		content
			.filter((file) => path.extname(file) === '.mdx')
			.map(async (file) => {
				const filePath = `${PROJECTS_DIR}/${file}`;
				const projectContent = await fs.readFile(filePath, 'utf8');
				const { data, content } = matter(projectContent);
				return { ...data, content } as Project;
			})
	);

	return projects
		.filter((project) => project !== null)
		.sort((a, b) =>
			a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0
		) as Project[];
};

export async function getProject(slug: string) {
	const projects = await getProjects();
	return projects.find((project) => project.slug === slug);
}
