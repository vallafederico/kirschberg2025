import { MdCircle } from "react-icons/md";
import ButtonSelector from "../../../components/ButtonSelector";

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
							type: "string",
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
									fields: [
										{
											name: "image",
											type: "image",
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
