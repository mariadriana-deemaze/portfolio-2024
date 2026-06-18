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
	GALLERY_ITEM_PROJECTION,
	LINK_PROJECTION,
	RICH_IMAGE_PROJECTION,
	SEO_PROJECTION
} from '@/lib/sanity-types';

// ── GROQ projections ──────────────────────────────────────────────────

const PROJECT_FIELDS = `
  title,
  description,
  year,
  displayOrder,
  featured,
  "slug": slug.current,
  medium,
  role,
  timeline,
  context,
  technologies,
  tags,
  colors,
  published,
  "coverImage": coverImage ${RICH_IMAGE_PROJECTION},
  "links": links[] ${LINK_PROJECTION},
  overview,
  problem,
  approach,
  "statistics": statistics[] { value, label },
  "gallery": gallery[] ${GALLERY_ITEM_PROJECTION},
  structuredBody,
  "seo": seo ${SEO_PROJECTION},
  // Legacy fields — still projected until migration completes
  hero,
  repo,
  liveUrl,
  body
`;

const NEXT_PROJECT_FIELDS = `
  title,
  "slug": slug.current,
  colors,
  "coverImage": coverImage ${RICH_IMAGE_PROJECTION},
  hero
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
	// Legacy
	hero?: string;
	repo?: string;
	liveUrl?: string;
	body?: string;
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
	// Legacy — available until migration completes
	hero: string;
	repo: string;
	liveUrl?: string;
	content: string;
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
		seo: project.seo,
		// Legacy
		hero: project.coverImage?.url ?? project.hero ?? '',
		repo: project.repo ?? '',
		liveUrl: project.liveUrl,
		content: project.body ?? ''
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
	hero: string;
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
		hero: p.coverImage?.url ?? p.hero ?? '',
		colors: Array.isArray(p.colors) ? p.colors : [],
		coverImage: p.coverImage
	};
}
