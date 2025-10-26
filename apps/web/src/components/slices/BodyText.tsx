import { PortableText } from "@local/sanity";
import { Show } from "solid-js";

export default function BodyText({ text }: { text: string }) {
	const components = {
		marks: {
			link: ({ value, ...rest }: { value: any }) => {
				const isExternal = ["mailto", "tel", "https", "http"].some((protocol) =>
					value.url.startsWith(protocol),
				);
				console.log(rest);
				const target = isExternal ? "_blank" : "_self";
				return (
					<a
						href={value.url}
						target={target}
						rel={value.noFollow ? "nofollow" : ""}
					>
						{value.text}
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
