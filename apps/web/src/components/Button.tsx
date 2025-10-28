import { type SanityLinkProps, sanityLink } from "@local/sanity";
import { A } from "@solidjs/router";
import cx from "classix";
import type { JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";

interface ButtonProps {
	children?: JSXElement;
	class?: string;
	variant?: "primary" | "circle";
	link?: SanityLinkProps;
	href?: string;
	onClick?: () => void;
}

export default function Button({
	children,
	variant = "primary",
	class: className = "",
	link,
	href,
	...props
}: ButtonProps) {
	const { attrs, label } = sanityLink(link);

	const element = link?.slug || link?.url || href ? A : "button";

	const VARIANT = {
		primary: "py-16 px-40 rounded-md flex-center nline-flex",
		circle: "rounded-full size-54 flex-center inline-flex",
	};

	return (
		<Dynamic
			component={element}
			{...attrs}
			{...props}
			class={cx(
				VARIANT[variant as keyof typeof VARIANT],
				className,
				"text-14 cursor-pointer text-center border border-[#0D0D0D]/25 font-medium bg-[#70706E] text-[white]",
			)}
		>
			{children || label}
		</Dynamic>
	);
}
