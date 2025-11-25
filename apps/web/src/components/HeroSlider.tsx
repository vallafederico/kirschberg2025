import { A } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
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

  createEffect(() => {
    if (index() !== undefined && Array.isArray(parallaxValues())) {
      if (index() === 0) {
        console.log(parallaxValues()[index()]);
      }
      const distance = Math.abs(parallaxValues()[index()]);
      const scale = 1 - distance * 0.05;
      setScale(scale);
    }
  });

  return (
    <li class="shrink-0 px-9">
      <article
        style={{
          transform: `scale(${scale()})`,
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
