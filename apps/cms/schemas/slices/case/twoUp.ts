export default {
  type: 'object', 
  name: 'twoUp',
  fields: [
    {
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ]
}