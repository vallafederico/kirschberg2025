import { getDocumentBySlug, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import {
  createAsync,
  query,
  useNavigate,
  type RouteSectionProps,
} from "@solidjs/router";
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

  const navigate = useNavigate();

  return (
    <SanityPage
      element="dialog"
      class="relative z-2 size-full bg-[black]/30 lg:pt-95 lg:pb-117"
      fetcher={data}
      open={true}
      aria-modal={true}
      aria-labelledby="case-title"
    >
      {(caseStudy: any) => {
        return (
          <>
            <SanityMeta pageData={caseStudy} />

            <article class="lg:rounded-xxl bg-primary text-inverted relative z-2 mx-auto min-h-[140vh] pb-20 lg:w-920 lg:px-64 lg:pt-54 lg:pb-86">
              <CaseStudyHero {...caseStudy} />
              <CaseStudyIntro {...caseStudy} />
              <div class="max-lg:px-margin-1 flex flex-col gap-32">
                <SanityComponents
                  components={caseStudy.slices}
                  componentList={SLICE_LIST}
                />
              </div>
            </article>
            <CaseStudySubnav link={caseStudy.liveLink} />
            <div
              onClick={() => navigate("/")}
              class="fixed inset-0 z-1 size-full bg-[black]/30 lg:backdrop-blur-xs"
            ></div>
          </>
        );
      }}
    </SanityPage>
  );
}
