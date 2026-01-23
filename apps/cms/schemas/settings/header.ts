import { createPreview } from "../../utils/preview";

export default {
	name: "settings.header",
	type: "document",
  preview: createPreview('{Header}'),
	fields: [
		{
			name: "email",
			title: "Email",
			type: "string",
			description: "Contact email address",
			validation: (Rule: any) =>
				Rule.required()
					.email("Please enter a valid email address")
					.lowercase(),
		},
		{
			name: "navLinks",
			hidden: true,
			type: "array",
			of: [{ type: "link" }],
		},
	],
};
