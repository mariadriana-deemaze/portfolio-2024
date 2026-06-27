import {defineField, defineType} from 'sanity'

export const galleryItemType = defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'richImage',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'Controls how the item spans the gallery grid.',
      options: {
        list: [
          {title: 'Full width (16:8)', value: 'wide'},
          {title: 'Half (4:3)', value: 'half'},
          {title: 'Third (3:4)', value: 'third'}
        ],
        layout: 'radio'
      },
      initialValue: 'half',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'image.alt',
      subtitle: 'layout',
      media: 'image'
    }
  }
})
