import cx from "classix";
import { Show } from "solid-js";
import Media from "../Media";

export default function TwoUp({ images }: { images: any[] }) {
	const sharedProps = {
		imageProps: {
			desktopWidth: 52,
			mobileWidth: 95,
		},
	};

	return (
		<section class="flex max-lg:flex-col">
			<Show when={images?.[0]}>
				{(media) => (
					<div class="w-full pr-4 max-lg:pb-4 max-lg:pr-0">
						<Media
							class={cx(
								"rounded-lg overflow-hidden w-full h-auto object-cover",
								media()?.withBorder && "border border-inverted/10",
							)}
							{...sharedProps}
							{...media()?.media}
						/>
					</div>
				)}
			</Show>
			<Show when={images?.[1]}>
				{(media) => (
					<div class="w-full max-lg:pl-0">
						<Media
							class={cx(
								"rounded-lg overflow-hidden w-full h-auto lg:h-full object-cover",
								media()?.withBorder && "border border-inverted/10",
							)}
							{...sharedProps}
							{...media()?.media}
						/>
					</div>
				)}
			</Show>
		</section>
	);
}
