import { SanityImage } from "@local/sanity";
import { Show } from "solid-js";

export default function Media({
	mediaType,
	image,
	video,
	class: className,
}: {
	mediaType: string;
	image: any;
	video: any;
	class?: string;
}) {
	console.log({
		mediaType,
		image,
		video,
	});
	return (
		<Show when={image?.asset}>
			<SanityImage class={className} desktopWidth={25} src={image} />
		</Show>
	);
}
