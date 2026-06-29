import {defineField, defineType} from 'sanity'

import {resolveI18nPreview, resolveI18nSlugSource, sanityI18n} from './utils'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta & Tags'},
    {name: 'seo', title: 'SEO'}
  ],
  fields: [
    // ── Core identity ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: sanityI18n.string,
      group: 'content',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: resolveI18nSlugSource('title')},
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: sanityI18n.text,
      group: 'content',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'datetime',
      group: 'content',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      description: 'Highlight this post on the homepage or journal index.',
      initialValue: false
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      group: 'content',
      initialValue: true
    }),

    // ── Media ──────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'richImage',
      group: 'content',
      description: 'Hero/cover image shown on the index card and article header.'
    }),

    // ── Structured body ────────────────────────────────────────────
    defineField({
      name: 'structuredBody',
      title: 'Structured Body',
      type: sanityI18n.body,
      group: 'content',
      description: 'Rich article content. Replaces the legacy MDX body.'
    }),

    // ── Meta & Tags ────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          {title: 'Engineering', value: 'engineering'},
          {title: 'Design', value: 'design'},
          {title: 'Career', value: 'career'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Reflection', value: 'reflection'}
        ],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
      options: {layout: 'tags'},
      description: 'Normalized lowercase tags for filtering and display.'
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'avatar',
          title: 'Avatar',
          type: 'image',
          options: {hotspot: true}
        }),
        defineField({
          name: 'url',
          title: 'Profile URL',
          type: 'url'
        })
      ]
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'meta',
      description: 'If this post was originally published elsewhere, set the canonical URL.'
    }),

    // ── Legacy fields (kept for migration) ─────────────────────────
    defineField({
      name: 'body',
      title: 'Body — MDX (legacy)',
      type: 'text',
      rows: 20,
      group: 'content',
      deprecated: {reason: 'Use structuredBody instead.'}
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords (legacy)',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
      deprecated: {reason: 'Use tags instead.'}
    }),
    defineField({
      name: 'link',
      title: 'External Link (legacy)',
      type: 'url',
      group: 'meta',
      deprecated: {reason: 'Use canonicalUrl instead.'}
    }),
    defineField({
      name: 'id',
      title: 'Legacy ID',
      type: 'string',
      group: 'meta',
      deprecated: {reason: 'No longer needed after migration.'}
    }),
    defineField({
      name: 'views',
      title: 'Views (legacy)',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      hidden: true,
      deprecated: {reason: 'Use the postMetric document instead.'}
    }),

    // ── SEO ────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      date: 'date',
      featured: 'featured',
      media: 'coverImage'
    },
    prepare({title, subtitle, date, featured, media}) {
      const prefix = featured ? '★ ' : ''
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : ''
      return {
        title: `${prefix}${resolveI18nPreview(title, 'Untitled')}`,
        subtitle: [subtitle, formattedDate].filter(Boolean).join(' · '),
        media
      }
    }
  },
  orderings: [
    {
      title: 'Publication Date (newest)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}]
    },
    {
      title: 'Publication Date (oldest)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}]
    }
  ]
})
