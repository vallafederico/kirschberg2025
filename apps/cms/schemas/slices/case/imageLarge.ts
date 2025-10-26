import { createPreview } from "../../../utils/preview";

export default {
	type: "object",
	preview: createPreview("{Media Large}", null, "media.image"),
	name: "imageLarge",
	fields: [
		{
			name: "media",
			type: "media",
		},
		{
			name: "withBorder",
			description: "Add an opaque, inversely coloredborder to the media item",
			type: "boolean",
			initialValue: false,
		},
	],
};
