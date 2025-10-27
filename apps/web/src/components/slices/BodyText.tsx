import { Show } from "solid-js";
import SanityRichText from "../SanityRichText";

export default function BodyText({ text }: { text: string }) {
	return (
		<section class="portable py-32 lg:pl-grid-2 lg:pr-50">
			<Show when={text}>{(t) => <SanityRichText value={t()} />}</Show>
		</section>
	);
}
