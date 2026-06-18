// ── Reusable GROQ projection fragments ────────────────────────────────

/** Resolves a richImage to url, dimensions, alt, caption, and crop/hotspot */
export const RICH_IMAGE_PROJECTION = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  hotspot,
  crop
}`;

/** Resolves a gallery item's nested richImage + layout */
export const GALLERY_ITEM_PROJECTION = `{
  layout,
  "image": image ${RICH_IMAGE_PROJECTION}
}`;

/** Resolves an SEO object's ogImage */
export const SEO_PROJECTION = `{
  title,
  description,
  "ogImage": ogImage.asset->url
}`;

/** Resolves a link object */
export const LINK_PROJECTION = `{ title, url }`;

/** Resolves an author object's avatar */
export const AUTHOR_PROJECTION = `{
  name,
  "avatar": avatar.asset->url,
  url
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
