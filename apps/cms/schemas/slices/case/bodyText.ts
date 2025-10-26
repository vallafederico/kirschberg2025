import { createPreview } from "../../../utils/preview";

export default {
	name: "bodyText",
	title: "Body",
	type: "object",
	preview: createPreview("{Body Text}", "text", null),
	fields: [
		{
			name: "text",
			type: "body",
		},
	],
};
