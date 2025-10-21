import { getDocumentByType, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query } from "@solidjs/router";
import { For } from "solid-js";

const getHomeData = query(async () => {
	"use server";

	return Promise.all([
		getDocumentByType("home"),
		getDocumentByType("case-study", {
			extraQuery: "{...}",
		}),
	]);
}, "home-data");

export const route = {
	preload: () => getHomeData(),
};

export default function Home() {
	const data = createAsync(() => getHomeData(), { deferStream: true });

	return (
		<SanityPage fetcher={data}>
			{([page, caseStudies]) => {
				return (
					<div class="flex h-screen flex-col">
						<SanityMeta isHomepage={true} pageData={page} />
						<header class="w-[40%] text-center mx-auto">
							<h1 class="text-32">{page.heading}</h1>
							<p class="text-18 mt-12">{page.blurb}</p>
						</header>
						<div>
							<For each={caseStudies}>
								{(caseStudy) => (
									<div>
										<h2>{caseStudy.title}</h2>
									</div>
								)}
							</For>
						</div>
					</div>
				);
			}}
		</SanityPage>
	);
}
