import { PortableText } from "@local/sanity";
import { Show } from "solid-js";
import AnimatedLine from "../AnimatedLine";

export default function AboutHero({
	title,
	body,
}: {
	title: string;
	body: any[];
}) {
	const components = {
		marks: {
			mediaLink: ({ value, text }: { value: any; text: string }) => {
				return (
					<a
					data-text={text}
						data-media-hover
						href={value.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						{text}
					</a>
				);
			},
		},
	};

	return (
		<header class="pt-128 lg:pt-250">
			<h2 class="text-32 font-[800] lg:w-[80%] lg:text-42 font-display">
				{title}
			</h2>
			<div class="portable opacity-85 [&_p]:not-last:!mb-24 mt-64 mb-34">
				<Show when={body}>
					{(b) => <PortableText components={components} value={b()} />}
				</Show>
			</div>
			<AnimatedLine />
		</header>
	);
}
