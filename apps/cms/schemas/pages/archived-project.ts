export default {
	name: "archived-project",
	title: "Archived Project",
	type: "document",
	fields: [
		{
			name: "title",
			type: "string",
		},
		{
			name: "featuredMedia",
			type: "array",
			of: [{ type: "media" }],
		},
    {
      name: 'link', 
      type: 'url'
    }
	],
};
