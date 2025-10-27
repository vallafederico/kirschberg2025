import { createPreview } from "../../../utils/preview";

export default {
	name: "aboutHero",
	type: "object",
	preview: createPreview("{Hero}", "blurb"),
	fields: [
		{
			name: "title",
			type: "string",
		},
		{
			name: "blurb",
			type: "body",
		},
	],
};
