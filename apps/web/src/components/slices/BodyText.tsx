import { PortableText, sanityLink } from "@local/sanity";
import { Show } from "solid-js";

export default function BodyText({ text }: { text: string }) {
	const components = {
		marks: {
			inlineLink: ({ value, text }: { value: any; text: string }) => {
				const isExternal = value.linkType === "external";

				const { attrs } = sanityLink(value);

				return (
					<a {...attrs} rel={value.noFollow ? "nofollow" : ""}>
						{text}
					</a>
				);
			},
		},
	};

	return (
		<section class="portable py-32 lg:w-[45%] mx-auto">
			<Show when={text}>
				{(t) => <PortableText components={components} value={t()} />}
			</Show>
		</section>
	);
}
