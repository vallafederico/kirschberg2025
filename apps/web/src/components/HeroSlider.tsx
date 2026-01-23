import { A } from "@solidjs/router";
import {
  ErrorBoundary,
  createEffect,
  For,
  Show,
} from "solid-js";
import Media from "~/components/Media";
import { useSmooothy } from "~/lib/hooks/useSmooothy";

const ArticleCard = ({
  slug,
  title,
  client,
  role,
  featuredMedia,
  liveLink,
  directLink,
  duplicated,
}: {
  slug: { fullUrl: string };
  title: string;
  client: { name: string }[];
  role: string[];
  featuredMedia: any;
  liveLink?: string;
  directLink?: boolean;
  duplicated?: boolean;
}) => {
  const formatedClient = client ? client.map((c) => c.name)?.join(" & ") : null;
  const formatedRole = role ? role?.join(", ") : null;

  const mediaItem = featuredMedia?.[duplicated ? 1 : 0];
  const hasMedia =
    mediaItem &&
    ((mediaItem.mediaType === "image" && mediaItem.image?.asset) ||
      (mediaItem.mediaType === "video" && mediaItem.video?.asset));
  const useDirectLink = Boolean(directLink && liveLink);
  const cardContent = (
    <>
      <div class="mb-12">
        <h2 class="text-18">{title}</h2>
        <p class="mt-2 text-12 font-semibold text-gry">
          {formatedClient}
          <Show when={formatedClient && formatedRole}>•</Show>
          {formatedRole}
        </p>
      </div>
      <div
        class={`overflow-hidden rounded-md ${
          !hasMedia
            ? "bg-gray-800"
            : mediaItem?.mediaType === "image"
              ? "bg-blue-500"
              : mediaItem?.mediaType === "video"
                ? "bg-green-500"
                : "bg-purple-500"
        }`}
      >
        {hasMedia ? (
          <Media
            imageProps={{
              desktopWidth: 35,
              mobileWidth: 45,
              priority: true,
            }}
            class="block w-full h-auto object-cover object-center"
            {...mediaItem}
          />
        ) : null}
      </div>
    </>
  );

  return (
    <li class="relative w-300 shrink-0 px-9">
      <article>
        <Show
          when={useDirectLink}
          fallback={
            <A href={slug?.fullUrl} class="pointer-events-none block w-300 px-10">
              {cardContent}
            </A>
          }
        >
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            class="pointer-events-none block w-300 px-10"
          >
            {cardContent}
          </a>
        </Show>
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

  createEffect(() => {
    const sliderInstance = slider();
    if (!sliderInstance || !sliderInstance.wrapper) return;

    let accumulatedDelta = 0;
    let rafId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();

        accumulatedDelta += e.deltaY;

        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        const updatePosition = () => {
          if (Math.abs(accumulatedDelta) > 0.1) {
            const scrollAmount = accumulatedDelta * 0.0005; // Adjust multiplier for sensitivity

            const sliderAny = sliderInstance as any;
            if (typeof sliderAny.target !== "undefined") {
              sliderAny.target -= scrollAmount; // Negative because scrolling down should move right
            }

            accumulatedDelta *= 0.85;

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
                <li class="relative h-340 w-300 shrink-0 px-9 outline-1 outline-gray-100/10 lg:h-380">
                  <div
                    class="absolute inset-y-0 left-1/2 flex items-center justify-center border-2 border-gray-400"
                    style={{ width: "500px", transform: "translateX(-50%)" }}
                  >
                    <p class="text-12 text-red-500">0.00</p>
                  </div>
                  <article class="hidden">
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
              <ArticleCard
                {...caseStudy}
              />
            </ErrorBoundary>
          );
        }}
      </For>
    </ul>
  );
}
