import { SanityImage } from "@local/sanity";
import { Show } from "solid-js";
import MuxVideo from "./MuxVideo";

interface MediaProps {
	mediaType: "image" | "video";
	image: any;
	video: any;
	class: string;
	videoProps: {
		autoplay?: boolean;
	};
}

export default function Media({
	mediaType = "image",
	image,
	video,
	class: className,
	videoProps = {},
}: MediaProps) {
	return (
		<>
			<Show when={mediaType === "image" && image?.asset}>
				<SanityImage class={className} desktopWidth={25} src={image} />
			</Show>
			<Show when={mediaType === "video" && video?.asset}>
				<MuxVideo {...videoProps} class={className} src={video} />
			</Show>
		</>
	);
}
