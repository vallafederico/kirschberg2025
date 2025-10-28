import { createPreview } from "../../utils/preview";

export default {
	name: "settings.header",
	type: "document",
  preview: createPreview('{Header}'),
	fields: [
		{
			name: "email",
			type: "string",
		},
		{
			name: "navLinks",
			hidden: true,
			type: "array",
			of: [{ type: "link" }],
		},
	],
};
