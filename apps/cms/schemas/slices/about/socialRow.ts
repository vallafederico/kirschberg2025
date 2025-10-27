import { MdLink } from "react-icons/md";
import { createPreview } from "../../../utils/preview";

export default {
	name: "socialRow",

	preview: createPreview("{Social Row}"),
	type: "object",
	fields: [
		{
			name: "items",
			type: "array",
			of: [
				{
					type: "object",
					icon: MdLink,
					preview: createPreview("name", "url"),
					fields: [
						{
							name: "name",
							type: "string",
						},
						{
							name: "url",
							type: "string",
						},
					],
				},
			],
		},
	],
};
