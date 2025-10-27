import { MdCircle } from "react-icons/md";
import ButtonSelector from "../../../components/ButtonSelector";
import { createPreview } from "../../../utils/preview";

export default {
	name: "linkList",
	type: "object",
	fields: [
		{
			name: "heading",
			type: "string",
		},
		{
			name: "items",
			type: "array",
			of: [
				{
					type: "object",
					icon: MdCircle,
					fields: [
						{
							name: "label",
							type: "string",
						},
						{
							name: "imageSize",
							title: "Media Size",
							type: "string",
							initialValue: "square",
							components: {
								input: ButtonSelector,
							},
							options: {
								list: [
									{ title: "Square", value: "square" },
									{ title: "Landscape", value: "landscape" },
								],
							},
						},
						{
							name: "items",
							type: "array",
							of: [
								{
									type: "object",
									preview: createPreview("title", "description"),
									icon: MdCircle,
									fields: [
										{
											name: "media",
											type: "media",
										},
										{
											name: "title",
											type: "string",
										},
										{
											name: "description",
											type: "string",
										},
										{
											name: "link",
											type: "url",
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
