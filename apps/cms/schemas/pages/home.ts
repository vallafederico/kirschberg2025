import createPage from "../../utils/createPage";

export default createPage({
	title: "Home",
	slug: false,
	slices: true,
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
