import createPage from "../../utils/createPage";

export default createPage({
	name: "case-study",
	prefix: "case",
	title: "Case Studies",
	fields: [
		{
			name: "byline",
			type: "text",
			rows: 3, 
			
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
