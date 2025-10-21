import MediaSelector from "../../components/MediaSelector/MediaSelector";

export default {
  name: 'media',
  components: {
    input: MediaSelector,
  },
  type: 'object',
  fields: [
    {
      name: 'mediaType', 
      initialValue: 'image',
      type: 'string',
      options: {
        list: ['image', 'video'],
      },
    },
    {
      name: 'image',
      type: 'image',
    },
    {
      name: 'video',
      type: 'mux.video',
    }
  ],
}