import { A } from "@solidjs/router";
import { createEffect, For, Show } from "solid-js";
import Media from "~/components/Media";
import { useSmooothy } from "~/lib/hooks/useSmooothy";

const ArticleCard = ({
  slug,
  title,
  client,
  role,
  featuredMedia,
}: {
  slug: { fullUrl: string };
  title: string;
  client: { name: string }[];
  role: string[];
  featuredMedia: any;
}) => {
  const formatedClient = client ? client.map((c) => c.name)?.join(" & ") : null;
  const formatedRole = role ? role?.join(", ") : null;

  return (
    <li class="shrink-0 px-9">
      <article>
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
  const { ref, slider } = useSmooothy({
    infinite: true,
  });

  createEffect(() => {
    console.log(slider());
  });

  return (
    <ul ref={ref} class="flex w-screen items-end pl-[50vw]">
      <For each={props.caseStudies}>
        {(caseStudy) => {
          return <ArticleCard {...caseStudy} />;
        }}
      </For>
    </ul>
  );
}
