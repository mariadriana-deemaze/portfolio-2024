import {defineField, defineType} from 'sanity'

import {sanityI18n} from '../utils'

export const richImageType = defineType({
  name: 'richImage',
  title: 'Rich Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: sanityI18n.string,
      description: 'Describe the image for screen readers and search engines.',
      validation: (rule) => rule.required().error('Alt text is required for accessibility.')
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: sanityI18n.string,
      description: 'Optional visible caption displayed beneath the image.'
    })
  ]
})
