import { Show, onMount, onCleanup, createEffect } from "solid-js";
import gsap from "~/lib/gsap";
import Media from "~/components/Media";

interface ArchiveCardProps {
  item: {
    featuredMedia?: any;
    link?: string;
  };
  index?: number;
  ready?: boolean | (() => boolean);
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

      // Generate small random delay (0 to 0.3 seconds)
      const randomDelay = Math.random() * 0.3;

      // Animate to visible after positioning is complete
      gsap.to(articleRef, {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: randomDelay,
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
        <div class="aspect-[.6/1] overflow-hidden rounded-md">
          <Media
            {...props.item.featuredMedia}
            imageProps={{
              desktopWidth: 100,
              mobileWidth: 100,
            }}
            class="h-full w-full object-cover"
          />
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
