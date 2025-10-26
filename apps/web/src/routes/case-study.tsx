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
			class=" lg:pt-95 lg:pb-117 relative z-2 bg-[black]/30 size-full"
			fetcher={data}
			open={true}
			aria-modal={true}
			aria-labelledby="case-title"
		>
			{(caseStudy: any) => {
				return (
					<>
						<SanityMeta pageData={caseStudy} />
						<article class="lg:w-920 z-2 relative lg:rounded-xxl min-h-[140vh] bg-primary text-inverted mx-auto lg:pb-86 lg:pt-54 lg:px-64 relative pb-20">
							<CaseStudyHero {...caseStudy} />
							<CaseStudyIntro {...caseStudy} />
							<div class="flex max-lg:px-margin-1 flex-col gap-32">
								<SanityComponents
									components={caseStudy.slices}
									componentList={SLICE_LIST}
								/>
							</div>
						</article>
						<CaseStudySubnav link={caseStudy.liveLink} />
						<div class="fixed z-1 inset-0 size-full bg-[black]/30 lg:backdrop-blur-[4px]"></div>
					</>
				);
			}}
		</SanityPage>
	);
}
