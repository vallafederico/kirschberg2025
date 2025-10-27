import { PortableText, sanityLink } from "@local/sanity";

export default function SanityRichText({ value }: { value: any }) {
	const components = {
		marks: {
			inlineLink: ({ value, text }: { value: any; text: string }) => {
				const isExternal = value.linkType === "external";

				const { attrs } = sanityLink(value);

				return (
					<a {...attrs} rel={value.noFollow ? "nofollow" : ""}>
						{text}
					</a>
				);
			},
		},
	};

	return <PortableText components={components} value={value} />;
}
