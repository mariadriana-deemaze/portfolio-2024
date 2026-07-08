import { fetchSanityQuery } from '@/lib/sanity';
import type {
	PortableTextBody,
	ResolvedGalleryItem,
	ResolvedImage,
	ResolvedLink,
	ResolvedMetric,
	ResolvedSeo
} from '@/lib/sanity-types';
import {
	LINK_PROJECTION,
	LOCALIZED_RICH_IMAGE_PROJECTION,
	localizedBody,
	localizedField
} from '@/lib/sanity-types';

// ── GROQ projections ──────────────────────────────────────────────────

const PROJECT_FIELDS = `
  "title": ${localizedField('title')},
  "description": ${localizedField('description')},
  year,
  displayOrder,
  featured,
  "slug": slug.current,
  "medium": ${localizedField('medium')},
  "role": ${localizedField('role')},
  "timeline": ${localizedField('timeline')},
  "context": ${localizedField('context')},
  technologies,
  tags,
  colors,
  published,
  "coverImage": coverImage ${LOCALIZED_RICH_IMAGE_PROJECTION},
  "links": links[] ${LINK_PROJECTION},
  "overview": ${localizedField('overview')},
  "problem": ${localizedField('problem')},
  "approach": ${localizedField('approach')},
  "statistics": statistics[] { value, "label": ${localizedField('label')} },
  "gallery": gallery[] { layout, "image": image ${LOCALIZED_RICH_IMAGE_PROJECTION} },
  "structuredBody": ${localizedBody('structuredBody')},
  "seo": seo { "title": ${localizedField('title')}, "description": ${localizedField('description')}, "ogImage": ogImage.asset->url }
`;

const NEXT_PROJECT_FIELDS = `
  "title": ${localizedField('title')},
  "slug": slug.current,
  colors,
  "coverImage": coverImage ${LOCALIZED_RICH_IMAGE_PROJECTION}
`;

// ── Sanity response types ─────────────────────────────────────────────

type SanityProject = {
	title: string;
	description: string;
	year: number | string;
	displayOrder?: number;
	featured?: boolean;
	slug: string;
	medium: string;
	role?: string;
	timeline?: string;
	context?: string;
	technologies?: string[];
	tags?: string[];
	colors?: string[];
	published?: boolean;
	coverImage?: ResolvedImage;
	links?: ResolvedLink[];
	overview?: string;
	problem?: string;
	approach?: string;
	statistics?: ResolvedMetric[];
	gallery?: ResolvedGalleryItem[];
	structuredBody?: PortableTextBody;
	seo?: ResolvedSeo;
};

// ── Application model ─────────────────────────────────────────────────

export interface Project {
	title: string;
	description: string;
	year: string;
	displayOrder?: number;
	featured: boolean;
	slug: string;
	medium: string;
	role?: string;
	timeline?: string;
	context?: string;
	technologies: { label: string }[];
	tags: string[];
	colors: string[];
	coverImage?: ResolvedImage;
	links: ResolvedLink[];
	overview?: string;
	problem?: string;
	approach?: string;
	statistics: ResolvedMetric[];
	gallery: ResolvedGalleryItem[];
	structuredBody?: PortableTextBody;
	seo?: ResolvedSeo;
}

// ── Normalizer ────────────────────────────────────────────────────────

function normalizeProject(project: SanityProject): Project {
	return {
		title: project.title,
		description: project.description,
		year: String(project.year),
		displayOrder: project.displayOrder,
		featured: project.featured ?? false,
		slug: project.slug,
		medium: project.medium,
		role: project.role,
		timeline: project.timeline,
		context: project.context,
		technologies: Array.isArray(project.technologies)
			? project.technologies.map((t) => ({ label: t }))
			: [],
		tags: Array.isArray(project.tags) ? project.tags : [],
		colors: Array.isArray(project.colors) ? project.colors : [],
		coverImage: project.coverImage,
		links: Array.isArray(project.links) ? project.links : [],
		overview: project.overview,
		problem: project.problem,
		approach: project.approach,
		statistics: Array.isArray(project.statistics) ? project.statistics : [],
		gallery: Array.isArray(project.gallery) ? project.gallery : [],
		structuredBody: project.structuredBody,
		seo: project.seo
	};
}

// ── Queries ───────────────────────────────────────────────────────────

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

export interface NextProject {
	title: string;
	slug: string;
	colors?: string[];
	coverImage?: ResolvedImage;
}

export async function getNextProject(
	displayOrder: number | undefined,
	slug: string
): Promise<NextProject | undefined> {
	const order = displayOrder ?? -1;
	const result = await fetchSanityQuery<SanityProject | null>(
		`*[_type == "project" && published != false && slug.current != $slug && displayOrder > $order] | order(displayOrder asc, year desc)[0]{ ${NEXT_PROJECT_FIELDS} }`,
		{ slug, order }
	);

	if (result) return normalizeNextProject(result);

	const wrap = await fetchSanityQuery<SanityProject | null>(
		`*[_type == "project" && published != false && slug.current != $slug] | order(displayOrder asc, year desc)[0]{ ${NEXT_PROJECT_FIELDS} }`,
		{ slug }
	);

	return wrap ? normalizeNextProject(wrap) : undefined;
}

function normalizeNextProject(p: SanityProject): NextProject {
	return {
		title: p.title,
		slug: p.slug,
		colors: Array.isArray(p.colors) ? p.colors : [],
		coverImage: p.coverImage
	};
}
