import { MdCircle } from "react-icons/md";

export default {
	name: "textList",
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
							name: "title",
							type: "string",
						},
						{
							name: "subItems",
							type: "array",
							of: [
								{
									type: "object",
									icon: MdCircle,
									fields: [
										{
											name: "title",
											type: "string",
										},
										{
											name: "subtext",
											type: "string",
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
