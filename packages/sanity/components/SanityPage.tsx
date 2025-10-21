import type { SanityDocumentStub } from "@sanity/client";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

interface SanityPageProps {
	children: (data: SanityDocumentStub) => JSX.Element;
	fetcher?: any;
	class?: string;
}

export default function SanityPage({
	children,
	fetcher = () => {},
	class: className = "",
}: SanityPageProps) {
	return (
		<div class={`min-h-screen ${className}`}>
			<Show when={fetcher()}>{children(fetcher())}</Show>
		</div>
	);
}
