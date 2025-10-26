import LinkOptions from "../../components/LinkOptions/LinkOptions";
import LinkTypeSelector from "../../components/LinkTypeSelector";
import { allPages } from "./link";

export default {
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
						name: "link",
						title: "Link",
						type: "object",
						components: {
							input: LinkOptions,
						},
						fields: [
							{
								name: "url",
								type: "string",
								title: "URL",
								description: "The URL of the link",
							},
							{
								name: "page",
								type: "reference",
								to: [...allPages],
							},
							{
								name: "linkType",
								type: "string",
								options: {
									list: [
										{ title: "Internal", value: "internal" },
										{ title: "External", value: "external" },
									],
								},
							},
							{
								name: "noFollow",
								title: "No Follow",
								type: "boolean",
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
};
