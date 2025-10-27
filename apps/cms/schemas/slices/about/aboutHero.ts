import { MdLink } from "react-icons/md";
import LinkOptions from "../../../components/LinkOptions/LinkOptions";
import { createPreview } from "../../../utils/preview";
import { allPages } from "../../blocks/link";

export default {
	name: "aboutHero",
	type: "object",
	preview: createPreview("{Hero}", "blurb"),
	fields: [
		{
			name: "title",
			type: "string",
		},
		{
			name: "body",
			type: "array",
			of: [
				{
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
					],
					lists: [
						{ title: "Bullets", value: "bullet" },
						{ title: "Numbers", value: "number" },
					],
					marks: {
						annotations: [
							{
								name: "mediaLink",
								title: "Link",
								icon: MdLink,
								type: "object",
								fields: [
									{
										name: "url",
										type: "string",
										title: "URL",
										description: "The URL of the link",
									},
									{
										name: "hoverMedia",
										type: "media",
									},
								],
							},
						],
						decorators: [
							{
								title: "Italics",
								value: "em",
							},
							{
								title: "Bold",
								value: "strong",
							},
							{
								title: "Underline",
								value: "underline",
							},
						],
					},
				},
			],
		},
	],
};
