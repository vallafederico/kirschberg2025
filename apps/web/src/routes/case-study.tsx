import { getDocumentBySlug, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import {
  createAsync,
  query,
  useNavigate,
  action,
  useSubmission,
  type RouteSectionProps,
} from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import CaseStudyHero from "~/components/CaseStudyHero";
import CaseStudyIntro from "~/components/CaseStudyIntro";
import CaseStudySubnav from "~/components/CaseStudySubnav";
import { SLICE_LIST } from "~/components/slices";

const getCaseStudyData = query(async (slug: string) => {
  "use server";

  return await getDocumentBySlug("case-study", slug);
}, "case-study");

const verifyPassword = action(async (formData: FormData) => {
  "use server";

  const password = formData.get("password") as string;
  const correctPassword = formData.get("correctPassword") as string;

  if (password === correctPassword) {
    return { success: true };
  }

  return { success: false, error: "Incorrect password" };
});

export default function CaseStudy(props: RouteSectionProps) {
  const slug = props.params.slug;
  const data = createAsync(() => getCaseStudyData(slug));
  const submission = useSubmission(verifyPassword);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

  const navigate = useNavigate();

  // Watch submission result and update authentication state
  createEffect(() => {
    if (submission.result?.success) {
      setIsAuthenticated(true);
    }
  });

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
        const hasPassword = Boolean(
          caseStudy.password &&
          typeof caseStudy.password === "string" &&
          caseStudy.password.trim() !== ""
        );

        const showContent = !hasPassword || isAuthenticated();

        return (
          <>
            <SanityMeta pageData={caseStudy} />

            <Show when={showContent}>
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
            </Show>

            <Show when={hasPassword && !showContent}>
              <div class="relative z-2 flex items-center justify-center min-h-full">
                <div class="lg:rounded-xxl bg-primary text-inverted relative z-2 mx-auto lg:w-920 lg:px-64 lg:py-54 max-lg:px-margin-1 py-40">
                  <div class="flex flex-col items-center gap-32">
                    <h2 class="text-32 font-display font-medium">Password Protection</h2>
                    <p class="text-16 opacity-80 text-center">
                      This case study is password protected. Please enter the password to
                      continue.
                    </p>
                    <form
                      action={verifyPassword}
                      method="post"
                      class="flex flex-col gap-16 w-full max-w-[400px]"
                    >
                      <input type="hidden" name="correctPassword" value={caseStudy.password} />
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        class="px-24 py-16 rounded-md bg-[#70706E] border border-[#0D0D0D]/25 text-[white] placeholder:text-[white]/60 focus:outline-none focus:ring-2 focus:ring-[white]/20"
                        autofocus
                        required
                      />
                      <Show when={submission.result?.error}>
                        <p class="text-14 text-red-400">{submission.result?.error}</p>
                      </Show>
                      <button
                        type="submit"
                        class="py-16 px-40 rounded-md flex-center inline-flex text-14 cursor-pointer text-center border border-[#0D0D0D]/25 font-medium bg-[#70706E] text-[white] hover:bg-[#70706E]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submission.pending}
                      >
                        {submission.pending ? "Checking..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Show>

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
