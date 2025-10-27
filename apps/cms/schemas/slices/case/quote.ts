import { MdFormatQuote } from "react-icons/md";
import { createPreview } from "../../../utils/preview";

export default {
	type: "object",
	icon: MdFormatQuote,
	name: "quote",
	preview: createPreview("quote", "author"),
	fields: [
		{
			name: "quote",
			type: "text",
			rows: 3,
		},
		{
			name: "author",
			type: "string",
		},
	],
};
