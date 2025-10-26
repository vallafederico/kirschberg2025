export default {
	name: "linedList",
	type: "object",
	fields: [
		{
			name: "items",
			type: "array",
			of: [{ type: "object" }],
			fields: [
				{
					name: "title",
					type: "string",
				},
				{
					name: "description",
					type: "text",
				},
			],
		},
	],
};
