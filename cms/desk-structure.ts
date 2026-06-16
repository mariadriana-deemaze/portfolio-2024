import type {StructureBuilder} from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Posts')),
      S.divider(),
      S.listItem()
        .title('Internal')
        .child(
          S.list()
            .title('Internal')
            .items([
              S.listItem()
                .title('Post Metrics')
                .schemaType('postMetric')
                .child(S.documentTypeList('postMetric').title('Post Metrics'))
            ])
        )
    ])
