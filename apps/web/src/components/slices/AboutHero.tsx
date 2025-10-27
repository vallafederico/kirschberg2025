import { Show } from "solid-js";
import AnimatedLine from "../AnimatedLine";
import SanityRichText from "../SanityRichText";

export default function AboutHero({
	title,
	blurb,
}: {
	title: string;
	blurb: string;
}) {
	return (
		<header class="pt-128 lg:pt-250">
			<h2 class="text-32 lg:text-42 font-display font-medium">{title}</h2>
			<div class="portable opacity-85 [&_p]:not-last:!mb-24 mt-64 mb-34">
				<Show when={blurb}>{(b) => <SanityRichText value={b()} />}</Show>
			</div>
			<AnimatedLine />
		</header>
	);
}
