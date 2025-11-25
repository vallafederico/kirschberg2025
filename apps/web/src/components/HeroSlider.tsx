import { A } from "@solidjs/router";
import { createEffect, createSignal, For, Show, onMount } from "solid-js";
import Media from "~/components/Media";
import { useSmooothy } from "~/lib/hooks/useSmooothy";

const ArticleCard = ({
  slug,
  title,
  client,
  role,
  featuredMedia,
  parallaxValues,
  index,
}: {
  slug: { fullUrl: string };
  title: string;
  client: { name: string }[];
  role: string[];
  featuredMedia: any;
  parallaxValues: any;
  index: any;
}) => {
  const formatedClient = client ? client.map((c) => c.name)?.join(" & ") : null;
  const formatedRole = role ? role?.join(", ") : null;

  const [scale, setScale] = createSignal(1);
  const [offset, setOffset] = createSignal(0);

  createEffect(() => {
    if (index() !== undefined && Array.isArray(parallaxValues())) {
      // if (index() === 0) {
      //   console.log(parallaxValues()[index()]);
      // }

      const value = parallaxValues()[index()];
      const distance = Math.abs(value || 0);
      const scale = 1 - distance * 0.1;
      setScale(scale);

      const sign = value < 0 ? -1 : 1;
      const scaleDeviation = 1 - scale;
      const offset = scaleDeviation * -150 * sign;
      setOffset(offset);
    }
  });

  return (
    <li class="shrink-0 px-9">
      <article
        style={{
          transform: `scale(${scale()}) translateX(${offset()}px)`,
          "transform-origin": "bottom center",
        }}
      >
        <A href={slug?.fullUrl} class="pointer-events-none block h-full w-300">
          <div class="mb-12">
            <h2 class="text-18">{title}</h2>
            <p class="text-12 text-gry mt-2 font-semibold">
              {formatedClient}
              <Show when={formatedClient && formatedRole}>•</Show>
              {formatedRole}
            </p>
          </div>
          <div class="h-340 overflow-hidden rounded-md lg:h-380">
            <Media
              imageProps={{
                desktopWidth: 35,
                mobileWidth: 45,
              }}
              class="relative top-1/2 size-full -translate-y-1/2 object-cover object-center"
              {...featuredMedia?.[0]}
            />
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
  const [parallaxValues, setParallaxValues] = createSignal<any>(null);

  const { ref, slider } = useSmooothy({
    infinite: true,
    onUpdate: ({ parallaxValues }: any) => {
      // Store parallax values for use in components
      setParallaxValues(parallaxValues);
    },
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

  return (
    <ul ref={ref} class="flex w-screen items-end pl-[calc(50vw-150px)]">
      <For each={props.caseStudies}>
        {(caseStudy, index) => {
          return (
            <ArticleCard
              {...caseStudy}
              parallaxValues={parallaxValues}
              index={index}
            />
          );
        }}
      </For>
    </ul>
  );
}
