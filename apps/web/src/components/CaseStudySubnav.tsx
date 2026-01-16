import { useNavigate } from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import { useKeypress } from "~/lib/hooks/useKeypress";
import gsap, { A } from "~/lib/gsap";
import Button from "./Button";

export default function CaseStudySubnav({ link }: { link: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  useKeypress("Escape", handleClick);

  let visitWebsiteRef: HTMLElement | undefined;
  let closeButtonRef: HTMLElement | undefined;

  createEffect(() => {
    // Track link to ensure effect runs when it changes
    const currentLink = link;

    // Calculate when main animation completes: delay (0.1s) + duration (1.2s) = 1.3s
    const mainAnimationDuration = 0.1 + A.page.in.duration;
    const buttons = [visitWebsiteRef, closeButtonRef].filter(
      Boolean,
    ) as HTMLElement[];

    if (buttons.length === 0) return;

    // Clean up any existing animations
    gsap.killTweensOf(buttons);

    // Set initial state: invisible
    gsap.set(buttons, {
      opacity: 0,
    });

    // Fade in after main animation completes
    gsap.to(buttons, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: mainAnimationDuration,
    });
  });

  return (
    <div class="pointer-events-none z-20">
      <div class="pb-margin-1 pointer-events-none z-20 flex items-end justify-center gap-12">
        <Show when={link}>
          <div ref={(el) => (visitWebsiteRef = el)}>
            <Button
              class="pointer-events-auto shrink-0"
              link={{
                url: link,
                label: "Visit Website",
                linkType: "external",
                slug: undefined,
              }}
            />
          </div>
        </Show>
        <div ref={(el) => (closeButtonRef = el)}>
          <Button
            class="pointer-events-auto shrink-0"
            aria-label="Close Case Study"
            aria-controls="case-study"
            variant="circle"
            onClick={handleClick}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              class="size-[.8em]"
            >
              <path
                d="M9.8125 1.8125L6.53125 5.09375L9.8125 8.40625C10.2188 8.78125 10.2188 9.4375 9.8125 9.8125C9.4375 10.2188 8.78125 10.2188 8.40625 9.8125L5.125 6.53125L1.8125 9.8125C1.4375 10.2188 0.78125 10.2188 0.40625 9.8125C0 9.4375 0 8.78125 0.40625 8.40625L3.6875 5.09375L0.40625 1.8125C0 1.4375 0 0.78125 0.40625 0.40625C0.78125 0 1.4375 0 1.8125 0.40625L5.125 3.6875L8.40625 0.40625C8.78125 0 9.4375 0 9.8125 0.40625C10.2188 0.78125 10.2188 1.4375 9.8125 1.8125Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
