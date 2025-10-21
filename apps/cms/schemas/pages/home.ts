import createPage from "../../utils/createPage";

export default createPage({
	title: "Home",
	slug: false,
	slices: false,
	preview: {
		select: {
			title: "title",
		},
		prepare(select: any) {
			return {
				title: select.title,
			};
		},
	},
	name: "home",
	fields: [
		{
			name: "heading",
			type: "string",
		},
		{
			name: "blurb",
			type: "text",
			rows: 3,
		},
	],
});
