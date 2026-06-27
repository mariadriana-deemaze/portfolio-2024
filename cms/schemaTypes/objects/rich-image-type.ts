import {defineField, defineType} from 'sanity'

export const richImageType = defineType({
  name: 'richImage',
  title: 'Rich Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
      validation: (rule) => rule.required().error('Alt text is required for accessibility.')
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional visible caption displayed beneath the image.'
    })
  ]
})
