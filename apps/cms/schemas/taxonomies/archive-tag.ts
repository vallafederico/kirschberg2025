import { AiFillTag } from "react-icons/ai";

export default {
	name: "archive-tag",
	title: "Archive Tag",
	type: "document",
	icon: AiFillTag,
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			name: "icon",
			type: "image",
			description:
				"A white icon, for dark mode the color will be automatically inverted",
		},
	],
};
