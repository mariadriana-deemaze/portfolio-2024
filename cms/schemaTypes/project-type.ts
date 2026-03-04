import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Image Path',
      type: 'string',
      description: 'Public image path, for example /images/projects/portfolio/preview.png',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'repo',
      title: 'Repository',
      type: 'string',
      description: 'Repository path appended to your GitHub base URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'colors',
      title: 'Brand Colors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Used to build project card gradients.',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'body',
      title: 'Body (MDX)',
      type: 'text',
      rows: 20,
      validation: (rule) => rule.required(),
    }),
  ],
})
