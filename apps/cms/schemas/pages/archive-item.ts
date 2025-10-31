export default {
	name: "archive-item",
	title: "Archive Item",
	type: "document",
	fields: [
		{
			name: "title",
			type: "string",
		},
		{
			name: "featuredMedia",
			type: "media",
		},
		{
			name: "link",
			description:
				"The link to the archived project, shows up as a button on the tag card beneath the media.",
			type: "url",
		},
		{
			name: "type",
			type: "reference",
			to: [{ type: "archive-tag" }],
		},
	],
};
