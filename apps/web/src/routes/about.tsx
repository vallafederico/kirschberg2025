import { getDocumentByType, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query } from "@solidjs/router";
import { SLICE_LIST } from "~/components/slices";

const getAboutData = query(async () => {
	"use server";

	return await getDocumentByType("about");
}, "about");

export default function AboutPage() {
	const data = createAsync(() => getAboutData());

	return (
		<SanityPage class="px-margin-1 lg:w-grid-5 mx-auto" fetcher={data}>
			{(page) => {
				return (
					<>
						<SanityMeta pageData={page} />
						<div class="gap-y-34 flex flex-col">
							<SanityComponents
								components={page.slices}
								componentList={SLICE_LIST}
							/>
						</div>
					</>
				);
			}}
		</SanityPage>
	);
}
