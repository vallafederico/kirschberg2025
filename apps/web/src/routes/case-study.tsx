import { getDocumentBySlug, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query, type RouteSectionProps } from "@solidjs/router";
import CaseStudyHero from "~/components/CaseStudyHero";
import CaseStudyIntro from "~/components/CaseStudyIntro";
import CaseStudySubnav from "~/components/CaseStudySubnav";
import { SLICE_LIST } from "~/components/slices";

const getCaseStudyData = query(async (slug: string) => {
	"use server";

	return await getDocumentBySlug("case-study", slug);
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
				return (
					<>
						<SanityMeta pageData={caseStudy} />
						<article class="lg:w-920 rounded-xxl overflow-hidden min-h-[140vh] bg-primary text-inverted mx-auto pb-86 pt-54 px-64 relative">
							<CaseStudyHero {...caseStudy} />
							<CaseStudyIntro {...caseStudy} />
							<div class="flex flex-col gap-32">
								<SanityComponents
									components={caseStudy.slices}
									componentList={SLICE_LIST}
								/>
							</div>
						</article>
						<CaseStudySubnav link={caseStudy.liveLink} />
					</>
				);
			}}
		</SanityPage>
	);
}
