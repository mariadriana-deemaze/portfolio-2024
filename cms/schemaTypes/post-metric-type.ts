import {defineField, defineType} from 'sanity'

export const postMetricType = defineType({
  name: 'postMetric',
  title: 'Post Metric',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (rule) => rule.required(),
      readOnly: true
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0)
    })
  ],
  preview: {
    select: {
      postTitle: 'post.title',
      views: 'views'
    },
    prepare({postTitle, views}) {
      return {
        title: postTitle || 'Unlinked metric',
        subtitle: `${views ?? 0} views`
      }
    }
  }
})
