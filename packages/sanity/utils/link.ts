import type { SanityLinkProps } from "../types";

export const sanityLink = (props: SanityLinkProps | undefined) => {
	if (!props)
		return {
			label: undefined,
			isExternal: false,
			url: undefined,
			slug: undefined,
			attrs: {
				href: undefined,
				rel: undefined,
				target: "_blank",
			},
		};
	const { url, label, linkType, slug, advanced } = props || {};
	const isExternal = linkType === "external";

	let rel = undefined as string | undefined;
	if (isExternal) {
		if (advanced?.noFollow) {
			rel = "noopener noreferrer";
		} else {
			rel = "noopener";
		}
	}

	const formattedSlug = isExternal ? undefined : slug?.fullUrl || slug?.current;

	return {
		linkType,
		label,
		isExternal,
		url: isExternal ? url : undefined,
		slug: isExternal ? undefined : formattedSlug,
		attrs: {
			rel,
			_target: isExternal ? "_blank" : undefined,
			href: isExternal ? url : formattedSlug,
		},
	};
};
