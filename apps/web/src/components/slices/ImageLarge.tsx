import cx from "classix";
import Media from "../Media";

export default function ImageLarge({
	media,
	withBorder,
}: {
	media: any;
	withBorder?: boolean;
}) {
	return (
		<section
			class={cx(
				"rounded-lg overflow-hidden",
				withBorder && "border border-inverted/10",
			)}
		>
			<Media
				imageProps={{
					desktopWidth: 52,
					mobileWidth: 95,
				}}
				class="w-full h-auto object-cover"
				{...media}
			/>
		</section>
	);
}
