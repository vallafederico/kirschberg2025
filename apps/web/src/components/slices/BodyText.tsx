import { PortableText } from "@local/sanity";
import { Show } from "solid-js";

export default function BodyText({ text }: { text: string }) {
	return (
		<section class="portable">
			<Show when={text}>{(t) => <PortableText value={t()} />}</Show>
		</section>
	);
}
