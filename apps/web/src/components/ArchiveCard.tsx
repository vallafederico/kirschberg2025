import { Show, onCleanup, createEffect } from "solid-js";
import gsap from "~/lib/gsap";
import Media from "~/components/Media";

interface ArchiveCardProps {
  item: {
    featuredMedia?: any;
    link?: string;
  };
  index?: number;
  ready?: boolean | (() => boolean);
  onImageClick?: () => void;
}

export default function ArchiveCard(props: ArchiveCardProps) {
  let articleRef!: HTMLElement;
  let hasAnimated = false;

  // Wait for columns to be ready before animating
  createEffect(() => {
    if (!articleRef || hasAnimated) return;
    // Handle both function and boolean values
    const isReady =
      typeof props.ready === "function"
        ? props.ready()
        : (props.ready ?? false);

    console.log(
      "[ArchiveCard] ready prop:",
      isReady,
      "hasAnimated:",
      hasAnimated,
    );

    if (isReady) {
      hasAnimated = true;
      console.log("[ArchiveCard] Starting animation");

      // Create staggered delay based on index with random variation
      // Base delay: 0.1s per index position
      // Random variation: 0 to 0.4s for organic feel
      const baseDelay = (props.index ?? 0) * 0.1;
      const randomVariation = Math.random() * 0.4;
      const totalDelay = baseDelay + randomVariation;

      // Animate to visible after positioning is complete
      gsap.to(articleRef, {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: totalDelay,
      });
    }
  });

  onCleanup(() => {
    if (articleRef) {
      gsap.killTweensOf(articleRef);
    }
  });

  return (
    <article
      ref={articleRef}
      class="invisible flex flex-col gap-12 opacity-0"
      style={{ "will-change": "opacity, visibility" }}
    >
      <Show when={props.item.featuredMedia}>
        <div class="aspect-[.6/1] overflow-clip rounded-md">
          <div
            class="h-full w-full cursor-pointer transition-transform duration-600 ease-out hover:scale-110"
            onClick={() => props.onImageClick?.()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                props.onImageClick?.();
              }
            }}
            aria-label="View image in overlay"
          >
            <Media
              {...props.item.featuredMedia}
              imageProps={{
                desktopWidth: 100,
                mobileWidth: 100,
              }}
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </Show>
      <div class="flex flex-col gap-4">
        <Show when={props.item.link}>
          <a
            href={props.item.link}
            target="_blank"
            rel="noopener noreferrer"
            class="text-14 mt-4 text-blue-600 hover:underline"
          >
            View Project →
          </a>
        </Show>
      </div>
    </article>
  );
}
