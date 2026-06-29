import {defineField, defineType} from 'sanity'

import {sanityI18n} from '../utils'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: sanityI18n.string,
      description: 'Overrides the document title for search engines and social previews.',
      validation: (rule) => rule.max(70).warning('Keep under 70 characters for best display.')
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: sanityI18n.text,
      description: 'Overrides the document description for search engines and social previews.',
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for best display.')
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Recommended 1200×630. Falls back to the document cover/hero if empty.',
      options: {hotspot: true}
    })
  ]
})
