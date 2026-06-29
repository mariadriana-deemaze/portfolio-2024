import {defineArrayMember, defineField, defineType} from 'sanity'

import {resolveI18nPreview, resolveI18nSlugSource, sanityI18n} from './utils'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta & Links'},
    {name: 'caseStudy', title: 'Case Study'},
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
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.required().integer().min(2000).max(2100)
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers appear first on the projects index.',
      validation: (rule) => rule.integer().min(0)
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      description: 'Highlight this project on the homepage or index.',
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
      description: 'Structured hero/cover image with alt text. Replaces the legacy hero path.'
    }),
    defineField({
      name: 'colors',
      title: 'Brand Colors',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      description: 'Used to build project card gradients.'
    }),

    // ── Meta & Links ───────────────────────────────────────────────
    defineField({
      name: 'medium',
      title: 'Medium',
      type: sanityI18n.string,
      group: 'meta',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: sanityI18n.string,
      group: 'meta',
      description: 'Your role on this project, e.g. "Design & Full-Stack".'
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: sanityI18n.string,
      group: 'meta',
      description: 'Project duration, e.g. "8 weeks · 2024".'
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: sanityI18n.string,
      group: 'meta',
      description: 'Client or context, e.g. "Internal / Open-source".'
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta'
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      group: 'meta',
      description: 'External links — live site, source repo, case study, etc.'
    }),

    // ── Case Study ─────────────────────────────────────────────────
    defineField({
      name: 'overview',
      title: 'Overview',
      type: sanityI18n.text,
      group: 'caseStudy',
      description: 'High-level project summary for the case-study page.'
    }),
    defineField({
      name: 'problem',
      title: 'Problem',
      type: sanityI18n.text,
      group: 'caseStudy',
      description: 'What challenge or opportunity prompted this project.'
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: sanityI18n.text,
      group: 'caseStudy',
      description: 'How the problem was tackled — process, decisions, trade-offs.'
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      of: [defineArrayMember({type: 'metric'})],
      group: 'caseStudy',
      description: 'Key results or metrics to highlight.',
      validation: (rule) => rule.max(6)
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'galleryItem'})],
      group: 'caseStudy',
      description: 'Screenshots and visuals showcasing the project.'
    }),
    defineField({
      name: 'structuredBody',
      title: 'Structured Body',
      type: sanityI18n.body,
      group: 'caseStudy',
      description: 'Rich case-study content. Replaces the legacy MDX body.'
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
      subtitle: 'medium',
      order: 'displayOrder',
      media: 'coverImage'
    },
    prepare({title, subtitle, order, media}) {
      const resolvedTitle = resolveI18nPreview(title, 'Untitled')
      return {
        title: order != null ? `${order}. ${resolvedTitle}` : resolvedTitle,
        subtitle: resolveI18nPreview(subtitle),
        media
      }
    }
  }
})
