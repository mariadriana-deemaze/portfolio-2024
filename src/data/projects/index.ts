import fs from 'node:fs/promises';
import matter from 'gray-matter';
import path from 'path';

import { fetchSanityQuery } from '@/lib/sanity';

const PROJECTS_DIR = './src/data/projects';

const PROJECT_FIELDS = `
  hero,
  title,
  description,
  year,
  "slug": slug.current,
  repo,
  liveUrl,
  medium,
  tags,
  colors,
  technologies,
  body,
  published
`;

export interface ProjectRaw {
	hero: string;
	title: string;
	description: string;
	year: string;
	slug: string;
	repo: string;
	liveUrl?: string;
	medium: string;
	tags: string[];
	colors: string[];
	technologies: string[];
}

type SanityProject = {
	hero: string;
	title: string;
	description: string;
	year: number | string;
	slug: string;
	repo: string;
	liveUrl?: string;
	medium: string;
	tags?: string[];
	colors?: string[];
	technologies?: string[];
	body?: string;
	published?: boolean;
};

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
	}[];
	repo: string;
	liveUrl?: string;
}

function normalizeProject(project: SanityProject): Project {
	return {
		hero: project.hero,
		title: project.title,
		description: project.description,
		medium: project.medium,
		tags: Array.isArray(project.tags) ? project.tags : [],
		colors: Array.isArray(project.colors) ? project.colors : [],
		year: String(project.year),
		slug: project.slug,
		content: project.body ?? '',
		technologies: Array.isArray(project.technologies)
			? project.technologies.map((technology) => ({ label: technology }))
			: [],
		repo: project.repo,
		liveUrl: project.liveUrl
	};
}

async function getProjectsFromMdx(): Promise<Project[]> {
	const content = await fs.readdir(PROJECTS_DIR);

	const projects = await Promise.all(
		content
			.filter((file) => path.extname(file) === '.mdx')
			.map(async (file) => {
				const filePath = `${PROJECTS_DIR}/${file}`;
				const projectContent = await fs.readFile(filePath, 'utf8');

				const { data, content } = matter(projectContent) as unknown as {
					data: ProjectRaw;
					content: string;
				};

				const project: Project = {
					...data,
					technologies: data.technologies.map((technology) => ({ label: technology })),
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
}

async function getProjectsFromSanity(): Promise<Project[]> {
	const projects = await fetchSanityQuery<SanityProject[]>(
		`*[_type == "project" && published != false] | order(year desc) { ${PROJECT_FIELDS} }`
	);

	return projects.map(normalizeProject);
}

async function getProjectFromMdx(slug: string): Promise<Project | undefined> {
	const projects = await getProjectsFromMdx();
	return projects.find((project) => project.slug === slug);
}

export const getProjects = async () => {
	try {
		const projects = await getProjectsFromSanity();

		if (projects.length > 0) {
			return projects;
		}

		console.warn('No published projects found in Sanity. Falling back to local MDX content.');
	} catch (error) {
		console.error('Failed to load projects from Sanity. Falling back to local MDX content.', error);
	}

	return getProjectsFromMdx();
};

export async function getProject(slug: string) {
	try {
		const project = await fetchSanityQuery<SanityProject | null>(
			`*[_type == "project" && published != false && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
			{ slug }
		);

		if (project) {
			return normalizeProject(project);
		}
	} catch (error) {
		console.error('Failed to load project from Sanity. Falling back to local MDX content.', error);
	}

	return getProjectFromMdx(slug);
}
