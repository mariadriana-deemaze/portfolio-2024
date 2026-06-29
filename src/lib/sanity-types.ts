// ── Localization helper ───────────────────────────────────────────────

/** Resolves an internationalized field with locale → English → flat-string fallback */
export function localizedField(field: string): string {
	return `coalesce(${field}[_key == $locale][0].value, ${field}[_key == "en"][0].value, ${field})`;
}

// ── Reusable GROQ projection fragments ────────────────────────────────

/** Resolves a richImage to url, dimensions, alt, caption, and crop/hotspot */
const RICH_IMAGE_PROJECTION = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  hotspot,
  crop
}`;

/** Resolves a link object */
export const LINK_PROJECTION = `{ title, url }`;

/** Resolves an author object's avatar */
export const AUTHOR_PROJECTION = `{
  name,
  "avatar": avatar.asset->url,
  url
}`;

/** Resolves an internationalized Portable Text body with inline richImage projection */
export function localizedBody(field: string): string {
	const inner = `{ ..., _type == "richImage" => ${RICH_IMAGE_PROJECTION} }`;
	return `coalesce(${field}[_key == $locale][0].value[]${inner}, ${field}[_key == "en"][0].value[]${inner}, ${field}[]${inner})`;
}

/** Resolves a richImage with localized alt and caption */
export const LOCALIZED_RICH_IMAGE_PROJECTION = `{
  "alt": ${localizedField('alt')},
  "caption": ${localizedField('caption')},
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  hotspot,
  crop
}`;

// ── Resolved application types ─────────────────────────────────────────

export interface ResolvedImage {
	alt: string;
	caption?: string;
	url: string;
	width: number;
	height: number;
	lqip?: string;
	hotspot?: { x: number; y: number; width: number; height: number };
	crop?: { top: number; bottom: number; left: number; right: number };
}

export interface ResolvedGalleryItem {
	layout: 'wide' | 'half' | 'third';
	image: ResolvedImage;
}

export interface ResolvedSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

export interface ResolvedLink {
	title: string;
	url: string;
}

export interface ResolvedAuthor {
	name: string;
	avatar?: string;
	url?: string;
}

export interface ResolvedMetric {
	value: string;
	label: string;
}

/** JSON-safe value type for TanStack Start serialization compatibility. */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Portable Text body — kept as the raw Sanity array.
 * The Portable Text renderer (PER-21) will consume this directly.
 */
export type PortableTextBody = { [key: string]: JsonValue }[];
