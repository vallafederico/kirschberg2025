import { buildSeoPayload } from "@crawl-me-maybe/web";
import { getDocumentByType } from "@local/sanity";
import { Link, Meta, Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import { SANITY_CONFIG } from "../../config";
import SchemaMarkup from "./SchemaMarkup";

type SanityMetaProps = {
	pageData?: any;
	seoDefaults?: any;
	schemaDefaults?: any;
	isHomepage?: boolean;
};

export default function SanityMeta({
	pageData,
	isHomepage = false,
}: SanityMetaProps) {
	const seoDefaults = createAsync(() => getDocumentByType("seoDefaults"), {
		deferStream: true,
	});

	const schemaDefaults = createAsync(
		() => getDocumentByType("schemaMarkupDefaults"),
		{
			deferStream: true,
		},
	);

	return (
		<Show when={seoDefaults()}>
			{(defaults) => {
				const { meta, schemas } = buildSeoPayload({
					globalSeoDefaults: defaults(),
					seoFieldName: "metadata",
					schemaDefaults: schemaDefaults(),
					pageMetadata: pageData,
					pageSchemaType: pageData?.schemaMarkup?.type,
					extraSchemaData: {
						_createdAt: pageData?._createdAt,
						_updatedAt: pageData?._updatedAt,
					},
					isHomepage,
					projectId: SANITY_CONFIG.projectId,
					dataset: SANITY_CONFIG.dataset,
				});

				return (
					<>
						<Title>{meta.title ?? ""}</Title>

						<For each={meta.favicons}>
							{(favicon) => (
								<Link
									rel="icon"
									href={favicon.href}
									type={favicon.type}
									sizes={favicon.sizes}
								/>
							)}
						</For>
						<meta charset="utf-8" />

						<Meta name="description" content={meta.description ?? ""} />
						{meta.robots && <Meta name="robots" content={meta.robots} />}

						{/* Open Graph */}
						<Meta property="og:title" content={meta.title ?? ""} />
						<Meta property="og:description" content={meta.description ?? ""} />
						<Meta property="og:url" content={meta.canonicalUrl ?? ""} />

						{/* Twitter */}
						<Meta property="twitter:card" content="summary_large_image" />
						<Meta property="twitter:title" content={meta.title ?? ""} />
						<Meta
							property="twitter:description"
							content={meta.description ?? ""}
						/>

						{/* Schema Markup */}
						<Show when={schemas && schemaDefaults()}>
							<SchemaMarkup schemas={schemas} />
						</Show>
					</>
				);
			}}
		</Show>
	);
}
