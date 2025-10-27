export default {
	name: "socialRow",
	type: "object",
	fields: [
		{
			name: "items",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "name",
							type: "string",
						},
						{
							name: "url",
							type: "url",
						},
					],
				},
			],
		},
	],
};
