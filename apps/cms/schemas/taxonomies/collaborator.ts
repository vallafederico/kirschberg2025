import { MdPerson } from "react-icons/md";
import { createPreview } from "../../utils/preview";

export default {
	type: "document",
	preview: createPreview("name", "url", MdPerson),
	name: "collaborator",
	title: "Collaborator",
	icon: MdPerson,
	fields: [
		{
			name: "name",
			type: "string",
		},
		{
			name: "url",
			title: "URL",
			type: "url",
		},
	],
};
