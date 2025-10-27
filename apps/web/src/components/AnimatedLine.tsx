import cx from "classix";
import lineScale from "~/animation/lineScale";

export default function AnimatedLine({ class: className }: { class?: string }) {
	return (
		<div
			class={cx("h-px bg-inverted/50 w-full scale-x-0 origin-left", className)}
			use:lineScale
		/>
	);
}
