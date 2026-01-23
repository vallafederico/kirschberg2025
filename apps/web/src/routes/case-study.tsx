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
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { parseCookies, setCookie } from "vinxi/http";
import CaseStudyHero from "~/components/CaseStudyHero";
import CaseStudyIntro from "~/components/CaseStudyIntro";
import CaseStudySubnav from "~/components/CaseStudySubnav";
import { SLICE_LIST } from "~/components/slices";
import gsap, { A } from "~/lib/gsap";
import Lenis from "lenis";

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
      class="fixed inset-0 z-2 m-0 size-full max-h-none max-w-none overflow-y-auto border-none bg-[black]/30 p-0"
      fetcher={data}
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

        // Click and drag scrolling for desktop with Lenis smooth scroll
        let isDragging = false;
        let startY = 0;
        let startScrollY = 0;
        let dialogLenis: Lenis | null = null;

        const handleMouseDown = (e: MouseEvent) => {
          // Only enable on desktop (lg breakpoint)
          if (window.innerWidth < 1024) return;

          // Don't start drag if clicking on interactive elements
          const target = e.target as HTMLElement;
          if (
            target.tagName === "A" ||
            target.tagName === "BUTTON" ||
            target.closest("a") ||
            target.closest("button") ||
            target.closest("[data-selectable]")
          ) {
            return;
          }

          isDragging = true;
          startY = e.clientY;

          // Get current scroll position from Lenis or scroll container
          if (dialogLenis) {
            startScrollY = dialogLenis.scroll;
          } else {
            const dialog = document.querySelector(
              "dialog[aria-labelledby='case-title']",
            ) as HTMLElement;
            startScrollY = dialog?.scrollTop || 0;
          }

          // Prevent text selection while dragging
          e.preventDefault();

          // Change cursor
          document.body.style.cursor = "grabbing";
          document.body.style.userSelect = "none";
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging) return;

          const deltaY = startY - e.clientY;
          const newScrollY = startScrollY + deltaY;

          // Use Lenis for smooth scrolling (without immediate flag for smoothness)
          if (dialogLenis) {
            dialogLenis.scrollTo(newScrollY, {
              duration: 0.8, // Short duration for responsive feel while still smooth
            });
          } else {
            // Fallback to direct scroll if Lenis not available
            const dialog = document.querySelector(
              "dialog[aria-labelledby='case-title']",
            ) as HTMLElement;
            if (dialog) {
              dialog.scrollTop = newScrollY;
            }
          }
        };

        const handleMouseUp = () => {
          if (!isDragging) return;

          isDragging = false;
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
        };

        const setupDragScroll = (dialogElement: HTMLElement) => {
          // Create a Lenis instance for the dialog to enable smooth scrolling
          dialogLenis = new Lenis({
            wrapper: dialogElement,
            autoResize: true,
          });

          // Connect Lenis to GSAP ticker
          gsap.ticker.add((time: number) => {
            dialogLenis?.raf(time * 1000);
          });

          dialogElement.addEventListener("mousedown", handleMouseDown);
          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener("mouseup", handleMouseUp);
          window.addEventListener("mouseleave", handleMouseUp);
        };

        const cleanupDragScroll = (dialogElement: HTMLElement) => {
          dialogElement.removeEventListener("mousedown", handleMouseDown);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
          window.removeEventListener("mouseleave", handleMouseUp);

          // Clean up Lenis instance
          if (dialogLenis) {
            dialogLenis.destroy();
            dialogLenis = null;
          }

          // Reset cursor and selection
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          isDragging = false;
        };

        // Open dialog as soon as we have case study data (regardless of authentication)
        createEffect(() => {
          let timeoutId: ReturnType<typeof setTimeout>;
          let focusBlurTimeoutId: ReturnType<typeof setTimeout>;

          // Find the dialog element after it's rendered and open it
          const findDialog = () => {
            const dialog = document.querySelector(
              "dialog[aria-labelledby='case-title']",
            ) as HTMLDialogElement;
            if (dialog) {
              // Open the dialog if it's not already open
              if (!dialog.open) {
                // Prevent auto-focus by blurring any focused element immediately after showModal
                const handleFocusIn = (e: FocusEvent) => {
                  // If focus moves to a link inside the dialog, blur it
                  const target = e.target as HTMLElement;
                  if (target.tagName === "A" && dialog.contains(target)) {
                    // Use setTimeout to blur after the browser's focus is set
                    focusBlurTimeoutId = setTimeout(() => {
                      target.blur();
                      dialog.removeEventListener("focusin", handleFocusIn);
                    }, 0);
                  }
                };

                dialog.addEventListener("focusin", handleFocusIn);
                dialog.showModal();

                // Also blur any element that might have been focused
                requestAnimationFrame(() => {
                  if (document.activeElement && document.activeElement !== dialog) {
                    (document.activeElement as HTMLElement).blur();
                  }
                });
              }

              // Ensure dialog is scrollable
              dialog.style.overflowY = "auto";
              dialog.style.maxHeight = "100vh";
            }
          };

          // Register cleanup at effect level (must be in reactive context)
          onCleanup(() => {
            clearTimeout(timeoutId);
            clearTimeout(focusBlurTimeoutId);
          });

          // Use requestAnimationFrame to ensure DOM is ready
          timeoutId = setTimeout(() => {
            findDialog();
          }, 100);
        });

        // Set up drag scroll only when content is shown (after authentication)
        createEffect(() => {
          if (!showContent) {
            // Clean up drag scroll if content is hidden
            if (dialogLenis) {
              dialogLenis.destroy();
              dialogLenis = null;
            }
            return;
          }

          let cleanupFn: (() => void) | undefined;
          let timeoutId: ReturnType<typeof setTimeout>;

          // Find the dialog element and set up drag scroll
          const findDialog = () => {
            const dialog = document.querySelector(
              "dialog[aria-labelledby='case-title']",
            ) as HTMLDialogElement;
            if (dialog) {
              setupDragScroll(dialog);

              // Scroll to top using Lenis after a brief delay to ensure it's initialized
              setTimeout(() => {
                if (dialogLenis) {
                  dialogLenis.scrollTo(0, { immediate: true });
                } else {
                  dialog.scrollTop = 0;
                }
              }, 50);

              return () => {
                cleanupDragScroll(dialog);
              };
            }
            return undefined;
          };

          // Register cleanup at effect level (must be in reactive context)
          onCleanup(() => {
            clearTimeout(timeoutId);
            cleanupFn?.();
          });

          // Use requestAnimationFrame to ensure DOM is ready
          timeoutId = setTimeout(() => {
            cleanupFn = findDialog();
          }, 100);
        });

        const animateArticle = () => {
          if (!articleRef || !showContent) return;

          // Kill any existing animation
          if (animationInstance) {
            animationInstance.kill();
            animationInstance = null;
          }

          // Reset any previous transforms
          gsap.set(articleRef, {
            clearProps: "transform,opacity",
          });

          // Set initial state: positioned out of view from bottom
          gsap.set(articleRef, {
            y: "100vh",
            opacity: 0,
            immediateRender: true,
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
          // This handles the case when the article is first rendered after authentication
          if (el && showContent) {
            // Use multiple requestAnimationFrame calls to ensure DOM is fully ready
            // This is especially important after authentication when the article is newly rendered
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Double-check that showContent is still true and ref is still valid
                if (articleRef && showContent) {
                  animateArticle();
                }
              });
            });
          }
        };

        // Track slug, showContent, and isAuthenticated as reactive dependencies
        createEffect(() => {
          // Access reactive values to track them
          const currentSlug = slug;
          const shouldShow = showContent;
          const authState = isAuthenticated();

          // Only proceed if content should be shown
          if (!shouldShow) {
            // If content shouldn't be shown, cleanup any existing animation
            if (animationInstance) {
              animationInstance.kill();
              animationInstance = null;
            }
            if (articleRef) {
              gsap.killTweensOf(articleRef);
            }
            return;
          }

          // Cleanup previous animation when slug changes
          if (animationInstance) {
            animationInstance.kill();
            animationInstance = null;
          }
          if (articleRef) {
            gsap.killTweensOf(articleRef);
          }

          // Trigger animation when content should be shown and ref is available
          // Use double requestAnimationFrame to ensure DOM is ready after authentication
          // This handles the case when showContent changes from false to true
          if (articleRef) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Double-check that showContent is still true and ref is still valid
                if (articleRef && showContent) {
                  animateArticle();
                }
              });
            });
          }
        });

        return (
          <>
            <SanityMeta pageData={caseStudy} />

            <Show when={showContent}>
              <div class="relative z-2 flex min-h-full justify-center lg:pt-95 lg:pb-117">
                <article
                  ref={setArticleRef}
                  class="lg:rounded-xxl bg-primary text-inverted relative z-2 md:min-h-[140vh] w-full max-w-[1160px] pt-16 pb-20 lg:pb-86"
                >
                  <CaseStudyHero {...caseStudy} />
                  <div class="px-16">
                    <CaseStudyIntro {...caseStudy} />
                    <div class="flex flex-col gap-32">
                      <SanityComponents
                        components={caseStudy.slices}
                        componentList={SLICE_LIST}
                      />
                    </div>
                  </div>
                  <div class="absolute pointer-events-none inset-0 z-1 size-full">
                    <div class="absolute inset-0 ">
                      <div class="sticky top-[90svh]">
                        <CaseStudySubnav link={caseStudy.liveLink} />
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </Show>

            <Show when={hasPassword && !showContent}>
              <div class="relative z-2 flex min-h-full items-center justify-center">
                <div class="lg:rounded-xxl bg-primary text-inverted max-lg:px-16 relative z-2 mx-auto py-40 w-full max-w-[1160px] lg:px-64 lg:py-54">
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
              class="fixed inset-0 z-1 size-full bg-[black]/30 lg:backdrop-blur-xs lg:scale-110"
            ></div>
          </>
        );
      }}
    </SanityPage>
  );
}
