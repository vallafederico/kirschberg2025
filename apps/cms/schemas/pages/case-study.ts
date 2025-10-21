import createPage from "../../utils/createPage";

export default createPage({
	name: "case-study",
	prefix: "case",
	title: "Case Studies",
	preview: {
		select: {
			title: "title",
			subtitle: "byline",
		},
		prepare(select: any) {
			const { title, byline, archived } = select;
			return {
				title,
				subtitle: byline,
			};
		},
	},
	slices: "caseStudySlices",
	fields: [
		{
			name: "featuredMedia",
			type: "array",
			description:
				"Pair of medias, the first item is used on the case study page, the second item is used on the archived project page",
			of: [{ type: "media" }],
		},

		{
			name: "byline",
			type: "text",
			rows: 3,
		},
		{
			name: "description",
			type: "strippedText",
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
