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
import { parseCookies, setCookie } from "vinxi/http";
import CaseStudyHero from "~/components/CaseStudyHero";
import CaseStudyIntro from "~/components/CaseStudyIntro";
import CaseStudySubnav from "~/components/CaseStudySubnav";
import { SLICE_LIST } from "~/components/slices";
import gsap, { A } from "~/lib/gsap";

const getCaseStudyData = query(async (slug: string) => {
  "use server";

  return await getDocumentBySlug("case-study", slug);
}, "case-study");

const checkAuthentication = query(async (slug: string) => {
  "use server";

  const cookies = parseCookies();
  const authCookie = cookies[`case-study-auth-${slug}`];

  return { isAuthenticated: authCookie === "true" };
}, "case-study-auth");

const verifyPassword = action(async (formData: FormData) => {
  "use server";

  const password = formData.get("password") as string;
  const correctPassword = formData.get("correctPassword") as string;
  const slug = formData.get("slug") as string;

  if (password === correctPassword) {
    // Set cookie to remember authentication for 30 days
    setCookie(`case-study-auth-${slug}`, "true", {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return { success: true };
  }

  return { success: false, error: "Incorrect password" };
});

export default function CaseStudy(props: RouteSectionProps) {
  const slug = props.params.slug;
  const data = createAsync(() => getCaseStudyData(slug));
  const authStatus = createAsync(() => checkAuthentication(slug));
  const submission = useSubmission(verifyPassword);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

  const navigate = useNavigate();

  createEffect(() => {
    if (authStatus()?.isAuthenticated) {
      setIsAuthenticated(true);
    }
  });

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
            caseStudy.password.trim() !== "",
        );

        const showContent = !hasPassword || isAuthenticated();
        let articleRef: HTMLElement | undefined;
        let animationInstance: GSAPAnimation | null = null;

        const animateArticle = () => {
          if (!articleRef || !showContent) return;

          // Kill any existing animation
          if (animationInstance) {
            animationInstance.kill();
            animationInstance = null;
          }

          // Set initial state: positioned out of view from bottom
          gsap.set(articleRef, {
            y: "100%",
            opacity: 0,
          });

          // Animate up after a brief delay to ensure everything is loaded
          animationInstance = gsap.to(articleRef, {
            y: 0,
            opacity: 1,
            ease: A.page.in.ease,
            duration: A.page.in.duration,
            delay: 0.1,
          });
        };

        const setArticleRef = (el: HTMLElement | undefined) => {
          // Cleanup previous animation when ref changes
          if (animationInstance) {
            animationInstance.kill();
            animationInstance = null;
          }
          if (articleRef) {
            gsap.killTweensOf(articleRef);
          }

          articleRef = el;

          // Trigger animation when ref is set and content should be shown
          if (el && showContent) {
            requestAnimationFrame(() => {
              animateArticle();
            });
          }
        };

        // Track slug and showContent as reactive dependencies
        createEffect(() => {
          // Access slug and showContent to track them reactively
          const currentSlug = slug;
          const shouldShow = showContent;

          // Cleanup previous animation when slug changes
          if (animationInstance) {
            animationInstance.kill();
            animationInstance = null;
          }
          if (articleRef) {
            gsap.killTweensOf(articleRef);
          }

          // Trigger animation when content should be shown and ref is available
          if (articleRef && shouldShow) {
            // Use requestAnimationFrame to ensure DOM is ready after navigation
            requestAnimationFrame(() => {
              animateArticle();
            });
          }
        });

        return (
          <>
            <SanityMeta pageData={caseStudy} />

            <Show when={showContent}>
              <article
                ref={setArticleRef}
                key={`case-study-${slug}`}
                class="lg:rounded-xxl bg-primary text-inverted relative z-2 mx-auto min-h-[140vh] pb-20 lg:w-920 lg:px-64 lg:pt-54 lg:pb-86"
              >
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
              <div class="relative z-2 flex min-h-full items-center justify-center">
                <div class="lg:rounded-xxl bg-primary text-inverted max-lg:px-margin-1 relative z-2 mx-auto py-40 lg:w-920 lg:px-64 lg:py-54">
                  <div class="flex flex-col items-center gap-32">
                    <h2 class="text-32 font-display font-medium">
                      Password Protection
                    </h2>
                    <p class="text-16 text-center opacity-80">
                      This case study is password protected. Please enter the
                      password to continue.
                    </p>
                    <form
                      action={verifyPassword}
                      method="post"
                      class="flex w-full max-w-[400px] flex-col gap-16"
                    >
                      <input
                        type="hidden"
                        name="correctPassword"
                        value={caseStudy.password}
                      />
                      <input type="hidden" name="slug" value={slug} />
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        class="rounded-md border border-[#0D0D0D]/25 bg-[#70706E] px-24 py-16 text-[white] placeholder:text-[white]/60 focus:ring-2 focus:ring-[white]/20 focus:outline-none"
                        autofocus
                        required
                      />
                      <Show when={submission.result?.error}>
                        <p class="text-14 text-red-400">
                          {submission.result?.error}
                        </p>
                      </Show>
                      <button
                        type="submit"
                        class="flex-center text-14 inline-flex cursor-pointer rounded-md border border-[#0D0D0D]/25 bg-[#70706E] px-40 py-16 text-center font-medium text-[white] transition-colors hover:bg-[#70706E]/80 disabled:cursor-not-allowed disabled:opacity-50"
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
