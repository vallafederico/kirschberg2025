import cx from "classix";
import type { JSXElement } from "solid-js";
import styles from "./accordion.module.css";

interface AccordionProps {
	title: string;
	children: JSXElement;
	name: string;
	class?: string;
	headingClass?: string;
	panelClass?: string;
}

export default function Accordion({
	title,
	children,
	name,
	class: className = "",
	headingClass: headingclass = "",
	panelClass: panelclass = "",
}: AccordionProps) {
	return (
		<details class={`${styles.accordion} ${className}`} name={name}>
			<summary
				class={cx(
					headingclass,
					"py-21 justify-between px-16 flex items-center gap-15",
				)}
			>
				<div class="text-12-mono opacity-88 font-mono uppercase">{title}</div>
			</summary>
			<div
				data-accordion="panel"
				class={cx("border-b border-b-white/20", panelclass)}
			>
				<div data-accordion="content">{children}</div>
			</div>
		</details>
	);
}
