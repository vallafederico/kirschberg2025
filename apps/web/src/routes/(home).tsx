import { getDocumentByType, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query } from "@solidjs/router";
import HomeHero from "~/components/slices/HomeHero";

const getHomeData = query(async () => {
	"use server";

	return Promise.all([
		getDocumentByType("home"),
		getDocumentByType("case-study", {
			extraQuery: "{title,role,featuredMedia,client{name}}",
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
					<>
						<SanityMeta isHomepage={true} pageData={page} />
						<HomeHero caseStudies={caseStudies} {...page} />
					</>
				);
			}}
		</SanityPage>
	);
}
