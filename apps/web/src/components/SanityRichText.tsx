import { PortableText, sanityLink } from "@local/sanity";

export default function SanityRichText({ value }: { value: any }) {
	const components = {
		marks: {
			link: ({ value, children }: { value: any; children: any }) => {
				const isExternal = value.linkType === "external";

				const { attrs } = sanityLink(value);

				return (
					<a {...attrs} rel={value.noFollow ? "nofollow" : ""}>
						{children}
					</a>
				);
			},
		},
	};

	return <PortableText components={components} value={value} />;
}
