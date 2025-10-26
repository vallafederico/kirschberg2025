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
	],
};
