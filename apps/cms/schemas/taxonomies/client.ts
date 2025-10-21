import { MdBusiness } from "react-icons/md";

export default {
	type: "document",
	name: "client",
	title: "Client",
	icon: MdBusiness,
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			name: "url",
			type: "url",
			title: "URL",
		},
	],
};
