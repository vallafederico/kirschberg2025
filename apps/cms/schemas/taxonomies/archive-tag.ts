export default {
	name: "archive-tag",
	title: "Archive Tag",
	type: "document",
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			name: "icon",
			type: "image",
			description:
				"A white icon, for dark mode the color will be automatically inverted",
		},
	],
};
