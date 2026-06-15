import { fetchSanityQuery } from '@/lib/sanity';

const PROJECT_FIELDS = `
  hero,
  title,
  description,
  year,
  displayOrder,
  role,
  timeline,
  context,
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

type SanityProject = {
	hero: string;
	title: string;
	description: string;
	year: number | string;
	displayOrder?: number;
	role?: string;
	timeline?: string;
	context?: string;
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
	displayOrder?: number;
	role?: string;
	timeline?: string;
	context?: string;
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
		liveUrl: project.liveUrl,
		displayOrder: project.displayOrder,
		role: project.role,
		timeline: project.timeline,
		context: project.context
	};
}

export const getProjects = async (): Promise<Project[]> => {
	const projects = await fetchSanityQuery<SanityProject[]>(
		`*[_type == "project" && published != false] | order(displayOrder asc, year desc) { ${PROJECT_FIELDS} }`
	);
	return projects.map(normalizeProject);
};

export async function getProject(slug: string): Promise<Project | undefined> {
	const project = await fetchSanityQuery<SanityProject | null>(
		`*[_type == "project" && published != false && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
		{ slug }
	);
	return project ? normalizeProject(project) : undefined;
}

const NEXT_PROJECT_FIELDS = `title, "slug": slug.current, hero, colors`;

export async function getNextProject(displayOrder: number | undefined, slug: string) {
	const order = displayOrder ?? -1;
	const result = await fetchSanityQuery<SanityProject | null>(
		`*[_type == "project" && published != false && slug.current != $slug && displayOrder > $order] | order(displayOrder asc, year desc)[0]{ ${NEXT_PROJECT_FIELDS} }`,
		{ slug, order }
	);

	if (result)
		return { title: result.title, slug: result.slug, hero: result.hero, colors: result.colors };

	const wrap = await fetchSanityQuery<SanityProject | null>(
		`*[_type == "project" && published != false && slug.current != $slug] | order(displayOrder asc, year desc)[0]{ ${NEXT_PROJECT_FIELDS} }`,
		{ slug }
	);

	return wrap
		? { title: wrap.title, slug: wrap.slug, hero: wrap.hero, colors: wrap.colors }
		: undefined;
}
