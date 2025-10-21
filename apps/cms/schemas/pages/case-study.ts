import createPage from "../../utils/createPage";

export default createPage({
	name: "case-study",
	prefix: "case",
	title: "Case Studies",
	preview: {
		select: {
			title: 'title',
					subtitle: 'byline',
				archived: 'archived',
				media: 'featuredMedia',
			},
			prepare(select: any) {
				const { title, byline, archived, media } = select;
				return {
					title,
					subtitle: byline,
					media,
				};
			},
		},
	slices: 'caseStudySlices',
	fields: [
		{
			name: 'featuredMedia', 
			type: 'media',
		},

		{
			name: "byline",
			type: "text",
			rows: 3, 
		},
		{
			name: 'description', 
			type: 'strippedText'
		},
		{
			name: "role",
			type: "array",
			of: [{ type: "string" }],
		},
		{
			name: "client",
			type: "array",
			of: [{ type: "reference", to: [{ type: "client" }] }],
		},
		{
			name: "team",
			type: "array",
			of: [{ type: "reference", to: [{ type: "collaborator" }] }],
		},
	],
});
