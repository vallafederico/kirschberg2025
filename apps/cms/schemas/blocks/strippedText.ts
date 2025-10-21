export default {
  title: 'Plain Text',
  name: 'strippedText',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'}
      ],
      lists: [],
      marks: {
        decorators: [
          {
            title: 'Italics',
            value: 'em',
          },
          {
            title: 'Bold',
            value: 'strong',
          },
        ],
        annotations: []
      }
    }
  ]
}
