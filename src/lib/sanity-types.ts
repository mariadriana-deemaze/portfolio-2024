// ── Localization helper ───────────────────────────────────────────────

/**
 * Resolves an internationalized field: locale → English (both keyed on the v5 `language` field),
 * with a v4 `_key`-keyed fallback for any not-yet-backfilled items. The final branch returns the
 * raw value only when the field is a genuine legacy flat string (`field[0]` undefined) — never a
 * wrapper array with no usable value, which would otherwise leak `{_key,_type,language,value}`
 * objects into the renderer.
 */
export function localizedField(field: string): string {
	return `coalesce(${field}[language == $locale][0].value, ${field}[language == "en"][0].value, ${field}[_key == "en"][0].value, select(!defined(${field}[0]) => ${field}))`;
}

// ── Reusable GROQ projection fragments ────────────────────────────────

/** Resolves a link object */
export const LINK_PROJECTION = `{ title, url }`;

/** Resolves an author object's avatar */
export const AUTHOR_PROJECTION = `{
  name,
  "avatar": avatar.asset->url,
  url
}`;

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

/**
 * Resolves an internationalized Portable Text body with inline richImage projection.
 * Matches the v5 `language` field first, falls back to v4 `_key`, then to a raw (unwrapped)
 * Portable Text array. The wrapped branches always win for migrated data, so a wrapper object
 * never leaks into the renderer. Inline images resolve alt/caption through the localized
 * projection, so their internationalized-array values are flattened to strings too.
 */
export function localizedBody(field: string): string {
	const inner = `{ ..., _type == "richImage" => ${LOCALIZED_RICH_IMAGE_PROJECTION} }`;
	return `coalesce(${field}[language == $locale][0].value[]${inner}, ${field}[language == "en"][0].value[]${inner}, ${field}[_key == "en"][0].value[]${inner}, ${field}[]${inner})`;
}

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
