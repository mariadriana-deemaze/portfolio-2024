import {defineField, defineType} from 'sanity'

export const metricType = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'The prominent figure, e.g. "300+", "<80ms", "0".',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Short description beneath the value.',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {title: 'value', subtitle: 'label'}
  }
})
