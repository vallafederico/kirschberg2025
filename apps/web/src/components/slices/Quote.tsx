import { Show } from "solid-js";

export default function Quote({
	quote,
	author,
}: {
	quote: string;
	author: string;
}) {
	return (
		<section class="pt-64 pb-98 lg:pl-grid-2 lg:pr-50">
			<span class="text-37 font-sans">“</span>
			<Show when={quote}>
				<blockquote class="text-32 lg:text-37 font-display">{quote}</blockquote>
			</Show>
			<Show when={author}>
				<p class="text-18 font-sans opacity-80 mt-12 font-semibold">{author}</p>
			</Show>
		</section>
	);
}
