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
	const { url, label, linkType, slug, noFollow, page } = props || {};
	const isExternal = linkType === "external";

	let rel = undefined as string | undefined;
	if (isExternal) {
		if (noFollow) {
			rel = "noopener noreferrer";
		} else {
			rel = "noopener";
		}
	}

	const slugBase = slug || page;

	const formattedSlug = isExternal
		? undefined
		: slugBase?.fullUrl || slugBase?.current;

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
