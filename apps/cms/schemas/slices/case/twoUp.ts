import { createPreview } from "../../../utils/preview";

export default {
	type: "object",
	name: "twoUp",
	preview: createPreview("{Two Up}", null, "images[0]"),
	fields: [
		{
			name: "images",
			title: "Media Items",
			type: "array",
			of: [
				{
					type: "object",
					preview: createPreview("{Media Item}", null, "media.image"),
					fields: [
						{
							name: "media",
							type: "media",
						},
						{
							name: "withBorder",
							description:
								"Add an opaque, inversely coloredborder to the media item",
							type: "boolean",
							initialValue: false,
						},
					],
				},
			],
		},
	],
};
