import { MdImage, MdPlayCircle } from "react-icons/md";
import MediaSelector from "../../components/MediaSelector/MediaSelector";

export default {
	name: "media",
	components: {
		input: MediaSelector,
	},
	preview: {
		select: {
			video: "video",
			mediaType: "mediaType",
			image: "image",
		},
		prepare({ image, mediaType }) {
			return {
				title: mediaType === "image" ? "Image" : "Video",
				media: mediaType === "image" && image,
				icon: mediaType === "image" ? MdImage : MdPlayCircle,
			};
		},
	},
	type: "object",
	fields: [
		{
			name: "mediaType",
			initialValue: "image",
			type: "string",
			options: {
				list: ["image", "video"],
			},
		},
		{
			name: "image",
			type: "image",
		},
		{
			name: "video",
			type: "mux.video",
			options: {
				collapsable: false,
				collapsed: false,
			},
		},
	],
};
