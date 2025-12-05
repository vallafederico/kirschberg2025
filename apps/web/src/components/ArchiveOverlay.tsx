import { Show, onMount, onCleanup, createEffect, createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import gsap from "~/lib/gsap";
import { useKeypress } from "~/lib/hooks/useKeypress";
import Media from "~/components/Media";

interface ArchiveOverlayProps {
  item: {
    _id?: string;
    title?: string;
    featuredMedia?: any;
    link?: string;
  } | null;
  onClose: () => void;
}

export default function ArchiveOverlay(props: ArchiveOverlayProps) {
  let overlayRef!: HTMLDivElement;
  let contentRef!: HTMLDivElement;
  let closeButtonRef!: HTMLButtonElement;
  let backdropRef!: HTMLDivElement;
  const [isVisible, setIsVisible] = createSignal(false);

  // Handle ESC key to close
  useKeypress("Escape", () => {
    if (props.item) {
      props.onClose();
    }
  });

  // Animate overlay in/out
  createEffect(() => {
    if (isServer) return;

    if (props.item) {
      const displayedId = props.item?._id || "no-id";
      const displayedTitle = props.item?.title || "no-title";
      const displayedMedia = props.item?.featuredMedia;
      console.log(
        "[ArchiveOverlay] Displayed item - ID:",
        displayedId,
        "Title:",
        displayedTitle,
      );
      console.log("[ArchiveOverlay] Displayed featuredMedia:", displayedMedia);
      console.log(
        "[ArchiveOverlay] Displayed image asset ID:",
        displayedMedia?.image?.asset?._id ||
          displayedMedia?.image?._id ||
          "no-image-id",
      );
      setIsVisible(true);

      // Wait for DOM to be ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!overlayRef || !backdropRef || !contentRef || !closeButtonRef)
            return;

          // Opening animation
          gsap.set([overlayRef, backdropRef], { autoAlpha: 0 });
          gsap.set(contentRef, { scale: 0.9, opacity: 0 });
          gsap.set(closeButtonRef, { opacity: 0 });

          gsap.to([overlayRef, backdropRef], {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(contentRef, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.1,
          });

          gsap.to(closeButtonRef, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2,
          });
        });
      });
    } else if (isVisible()) {
      // Closing animation - only run if we were visible
      if (overlayRef && backdropRef && contentRef && closeButtonRef) {
        gsap.to([contentRef, closeButtonRef], {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
        });

        gsap.to([overlayRef, backdropRef], {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
          delay: 0.1,
          onComplete: () => {
            setIsVisible(false);
          },
        });
      } else {
        setIsVisible(false);
      }
    }
  });

  // Prevent body scroll when overlay is open
  createEffect(() => {
    if (isServer) return;

    if (props.item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Cleanup animations on unmount
  onCleanup(() => {
    if (isServer) return;

    if (overlayRef) gsap.killTweensOf(overlayRef);
    if (backdropRef) gsap.killTweensOf(backdropRef);
    if (contentRef) gsap.killTweensOf(contentRef);
    if (closeButtonRef) gsap.killTweensOf(closeButtonRef);

    document.body.style.overflow = "";
  });

  const handleWrapperClick = (e: MouseEvent) => {
    // Close if clicking outside the content area
    const target = e.target as HTMLElement;
    if (contentRef && !contentRef.contains(target)) {
      props.onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    // Close when clicking directly on the backdrop
    e.stopPropagation();
    props.onClose();
  };

  const handleContentClick = (e: MouseEvent) => {
    // Prevent clicks inside content from closing the overlay
    e.stopPropagation();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Show when={props.item || isVisible()}>
      <div
        ref={overlayRef}
        class="fixed inset-0 z-50 flex items-center justify-center"
        style={{ "pointer-events": props.item ? "auto" : "none" }}
        onClick={handleWrapperClick}
      >
        {/* Backdrop */}
        <div
          ref={backdropRef}
          class="fixed inset-0 bg-black/80 backdrop-blur-sm"
          style={{ "pointer-events": props.item ? "auto" : "none" }}
          onClick={handleBackdropClick}
        />

        {/* Content */}
        <div
          ref={contentRef}
          class="px-margin-1 relative z-10 flex min-h-0 items-center justify-center"
          onClick={handleContentClick}
        >
          <div class="relative flex max-h-[90vh] w-full max-w-7xl flex-col items-center gap-8">
            {/* Image */}
            <Show when={props.item?.featuredMedia}>
              <div class="relative aspect-4/6 max-h-[60vh] w-full overflow-hidden rounded-md">
                <Media
                  {...props.item!.featuredMedia}
                  imageProps={{
                    desktopWidth: 100,
                    mobileWidth: 100,
                  }}
                  class="h-full w-full object-cover"
                />
              </div>
            </Show>

            {/* Link if available */}
            <Show when={props.item?.link}>
              <a
                href={props.item!.link}
                target="_blank"
                rel="noopener noreferrer"
                class="text-16 text-white underline transition-opacity hover:opacity-80"
              >
                View Project →
              </a>
            </Show>
          </div>
        </div>

        {/* Close button - fixed at bottom of page */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          class="fixed bottom-7 left-1/2 z-20 flex h-8 min-h-8 w-8 min-w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close overlay"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Show>
  );
}
