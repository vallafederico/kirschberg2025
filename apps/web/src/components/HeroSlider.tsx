import { A } from "@solidjs/router";
import { ErrorBoundary, createEffect, For } from "solid-js";
import Media from "~/components/Media";
import { useSmooothy } from "~/lib/hooks/useSmooothy";

const ArticleCard = ({
  slug,
  title,
  client,
  role,
  featuredMedia,
  duplicated,
}: {
  slug: { fullUrl: string };
  title: string;
  client: { name: string }[];
  role: string[];
  featuredMedia: any;
  duplicated?: boolean;
}) => {
  const formatedClient = client ? client.map((c) => c.name)?.join(" & ") : null;
  const formatedRole = role ? role?.join(", ") : null;

  const mediaItem = featuredMedia?.[duplicated ? 1 : 0];
  const hasMedia =
    mediaItem &&
    ((mediaItem.mediaType === "image" && mediaItem.image?.asset) ||
      (mediaItem.mediaType === "video" && mediaItem.video?.asset));

  return (
    <li class="shrink-0 px-9">
      <article>
        <A href={slug?.fullUrl} class="pointer-events-none block h-full w-300">
          <div class="mb-12">
            <h2 class="text-18">{title}</h2>
            {/* <p class="text-12 text-gry mt-2 font-semibold">
							{formatedClient}
							<Show when={formatedClient && formatedRole}>•</Show>
							{formatedRole}
						</p> */}
          </div>
          <div
            class={`h-340 overflow-hidden rounded-md lg:h-380 ${
              !hasMedia ? "bg-gray-800" : ""
            }`}
          >
            {hasMedia ? (
              <Media
                imageProps={{
                  desktopWidth: 35,
                  mobileWidth: 45,
                  priority: true,
                }}
                class="relative top-1/2 size-full -translate-y-1/2 object-cover object-center"
                {...mediaItem}
              />
            ) : null}
          </div>
        </A>
      </article>
    </li>
  );
};

interface HeroSliderProps {
  caseStudies: any[];
}

export default function HeroSlider(props: HeroSliderProps) {
  const { ref, slider } = useSmooothy({
    infinite: true,
    snap: false,
  });

  // Handle link clicks while allowing slider to slide
  createEffect(() => {
    const sliderInstance = slider();
    if (!sliderInstance) return;

    const handleLinks = () => {
      const links = sliderInstance.wrapper.querySelectorAll("a");
      links.forEach((link: HTMLAnchorElement) => {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isDragging = false;

        link.style.pointerEvents = "none";

        const handleMouseDown = (e: MouseEvent) => {
          startX = e.clientX;
          startY = e.clientY;
          startTime = Date.now();
          isDragging = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!startTime) return;

          const deltaX = Math.abs(e.clientX - startX);
          const deltaY = Math.abs(e.clientY - startY);

          if (deltaX > 5 || deltaY > 5) {
            isDragging = true;
          }
        };

        const handleMouseUp = (e: MouseEvent) => {
          const deltaTime = Date.now() - startTime;

          if (!isDragging && deltaTime < 200) {
            link.click();
          }

          startTime = 0;
          isDragging = false;
        };

        // Add listeners to the parent element (article)
        const parentElement = link.parentElement;
        if (parentElement) {
          parentElement.addEventListener("mousedown", handleMouseDown);
          parentElement.addEventListener("mousemove", handleMouseMove);
          parentElement.addEventListener("mouseup", handleMouseUp);
        }
      });
    };

    handleLinks();
  });

  // Handle wheel events for mouse scrolling
  createEffect(() => {
    const sliderInstance = slider();
    if (!sliderInstance || !sliderInstance.wrapper) return;

    let accumulatedDelta = 0;
    let rafId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Only handle vertical wheel scrolling
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();

        // Accumulate wheel delta
        accumulatedDelta += e.deltaY;

        // Cancel any pending animation
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        // Update slider position using requestAnimationFrame for smooth updates
        const updatePosition = () => {
          if (Math.abs(accumulatedDelta) > 0.1) {
            // Convert vertical scroll to horizontal slider movement
            const scrollAmount = accumulatedDelta * 0.0005; // Adjust multiplier for sensitivity

            // Update the target position directly (target is in pixels)
            const sliderAny = sliderInstance as any;
            if (typeof sliderAny.target !== "undefined") {
              sliderAny.target -= scrollAmount; // Negative because scrolling down should move right
            }

            // Decay accumulated delta
            accumulatedDelta *= 0.85;

            // Continue animation if there's still delta
            if (Math.abs(accumulatedDelta) > 0.1) {
              rafId = requestAnimationFrame(updatePosition);
            } else {
              rafId = null;
              accumulatedDelta = 0;
            }
          } else {
            rafId = null;
            accumulatedDelta = 0;
          }
        };

        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const wrapperElement = sliderInstance.wrapper;
    wrapperElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapperElement.removeEventListener("wheel", handleWheel);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  });

  return (
    <ul ref={ref} class="flex w-screen items-end pl-[calc(50vw-150px)]">
      <For each={props.caseStudies}>
        {(caseStudy) => {
          return (
            <ErrorBoundary
              fallback={(err, reset) => (
                <li class="shrink-0 px-9">
                  <article class="flex h-340 flex-col items-center justify-center rounded-md border border-red-300 bg-red-50 p-6 lg:h-380">
                    <div class="text-center">
                      <h3 class="text-14 mb-2 font-semibold text-red-800">
                        Error loading card
                      </h3>
                      <p class="text-12 mb-4 text-red-600">
                        {err?.message || "Unknown error occurred"}
                      </p>
                      <button
                        onClick={reset}
                        class="text-12 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Try again
                      </button>
                    </div>
                  </article>
                </li>
              )}
            >
              <ArticleCard {...caseStudy} />
            </ErrorBoundary>
          );
        }}
      </For>
    </ul>
  );
}
