import {defineArrayMember, defineField, defineType} from 'sanity'

export const bodyType = defineType({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'}
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'}
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'}
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']})
              })
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: 'richImage'
    }),
    defineArrayMember({
      name: 'code',
      title: 'Code Block',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              {title: 'TypeScript', value: 'typescript'},
              {title: 'JavaScript', value: 'javascript'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'JSON', value: 'json'},
              {title: 'Go', value: 'go'},
              {title: 'Bash', value: 'bash'},
              {title: 'SQL', value: 'sql'},
              {title: 'Plain text', value: 'text'}
            ]
          }
        }),
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
          description: 'Optional filename shown in the code bar.'
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 12,
          validation: (rule) => rule.required()
        })
      ],
      preview: {
        select: {title: 'filename', subtitle: 'language'},
        prepare({title, subtitle}) {
          return {title: title || 'Code block', subtitle: subtitle || 'plain text'}
        }
      }
    }),
    defineArrayMember({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Quote Text',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string'
        })
      ],
      preview: {
        select: {title: 'text', subtitle: 'attribution'},
        prepare({title, subtitle}) {
          return {
            title: title ? `"${title.slice(0, 60)}…"` : 'Pull quote',
            subtitle: subtitle || ''
          }
        }
      }
    })
  ]
})
