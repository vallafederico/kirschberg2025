import createPage from '../../utils/createPage'

export default createPage({
  name: 'case-study',
  prefix: '/case',
  title: 'Case Studies',
  preview: {
    select: {
      title: 'title',
      media: 'featuredMedia',
      subtitle: 'byline',
    },
    prepare(select: any) {
      const {title, byline, media} = select

      const image = media?.find((item: any) => item.mediaType === 'image')?.image

      return {
        title,
        subtitle: byline,
        media: image,
      }
    },
  },
  slices: 'caseStudySlices',
  fields: [
    {
      name: 'password',
      type: 'string',
      title: 'Password',
      description: 'Enter a password to protect the case study page',
    },
    {
      name: 'liveLink',
      type: 'url',
    },
    {
      name: 'directLink',
      type: 'boolean',
      title: 'Direct Link',
      description: 'When enabled, the case will link directly to the live link, otherwise it will link to the case study page.',
      initialValue: false,
    },
    {
      name: 'featuredMedia',
      type: 'array',
      description:
        'Pair of medias, the first item is used on the case study page, the second item is used on the archived project page',
      of: [{type: 'media'}],
    },
    {
     name: "casePageMedia",
     type: 'media',
     title: 'Case Page Hero',
    },
    {
      name: 'byline',
      type: 'text',
      rows: 3,
    },
    {
      name: 'description',
      type: 'strippedText',
    },
    {
      name: 'role',
      type: 'array',
      of: [{type: 'string'}],
    },

    {
      name: 'client',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'client'}]}],
    },
    {
      name: 'team',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'collaborator'}]}],
    },
    {
      name: 'showInNav',
      type: 'boolean',
      title: 'Show in Navigation Carousel',
      description: 'When enabled, this case study will be displayed in the navigation projects carousel. If not enough case studies are selected, the latest ones will be used to fill the carousel.',
      initialValue: false,
    },
    {
      name: 'hidden',
      type: 'boolean',
      title: 'Hidden',
      description: 'When enabled, this case study will be hidden from the frontend and will not appear in any listings or be accessible via direct links.',
      initialValue: false,
    },
  ],
})
