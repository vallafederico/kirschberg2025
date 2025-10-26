import {
	getDocumentBySlug,
	getDocumentByType,
	SanityPage,
} from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query, type RouteSectionProps } from "@solidjs/router";
import CaseStudyHero from "~/components/CaseStudyHero";
import CaseStudyIntro from "~/components/CaseStudyIntro";
import CaseStudySubnav from "~/components/CaseStudySubnav";

const getCaseStudyData = query(async (slug: string) => {
	"use server";

	const x = await getDocumentBySlug("case-study", slug);

	return x;
}, "case-study");

export default function CaseStudy(props: RouteSectionProps) {
	const slug = props.params.slug;
	const data = createAsync(() => getCaseStudyData(slug));

	return (
		<SanityPage
			element="dialog"
			class="backdrop-blur-[4px] pt-95 pb-117 relative z-2 bg-[black]/30 size-full"
			fetcher={data}
			open={true}
			aria-modal={true}
			aria-labelledby="case-title"
		>
			{(caseStudy: any) => {
				console.log(caseStudy);
				return (
					<>
						<article class="lg:w-[70%] rounded-xxl overflow-hidden min-h-[140vh] bg-primary text-inverted mx-auto pb-86 pt-54 px-64 border-2 relative">
							<SanityMeta pageData={caseStudy} />
							<CaseStudyHero {...caseStudy} />
							<CaseStudyIntro {...caseStudy} />
						</article>
						<CaseStudySubnav link={caseStudy.liveLink} />
					</>
				);
			}}
		</SanityPage>
	);
}
