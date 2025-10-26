import { createPreview } from "../../../utils/preview";

export default {
	type: "object",
	name: "twoUp",
	preview: createPreview("{Two Up}", null, "images[0]"),
	fields: [
		{
			name: "images",
			type: "array",
			of: [{ type: "media" }],
		},
	],
};
