import { SanityImage } from "@local/sanity";
import cx from "classix";
import { Show } from "solid-js";
import MuxVideo from "./MuxVideo";

interface MediaProps {
	mediaType: "image" | "video";
	image?: any;
	video?: any;
	class?: string;
	videoProps?: {
		autoplay?: boolean;
	};
	imageProps?: {
		desktopWidth?: number;
		mobileWidth?: number;
	};
}

export default function Media({
	mediaType = "image",
	image,
	video,
	class: className,
	videoProps = {},
	imageProps = {},
}: MediaProps) {
	return (
		<>
			<Show when={mediaType === "image" && image?.asset}>
				<SanityImage class={className} {...imageProps} src={image} />
			</Show>
			<Show when={mediaType === "video" && video?.asset}>
				<MuxVideo {...videoProps} class={className} src={video} />
			</Show>
		</>
	);
}
