import type { SanityDocumentStub } from "@sanity/client";
import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

interface SanityPageProps {
	children: (data: SanityDocumentStub) => JSX.Element;
	fetcher?: any;
	class?: string;
	element?: string;
}

export default function SanityPage({
	children,
	fetcher = () => {},
	class: className = "",
	element = "div",
	...rest
}: SanityPageProps) {
	return (
		<Dynamic component={element} {...rest} class={`${className}`}>
			<Show when={fetcher()}>{children(fetcher())}</Show>
		</Dynamic>
	);
}
