import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import Media from "~/components/Media";

interface HomeHeroProps {
  caseStudies: any[];
  heading?: string;
  blurb?: string;
}

export default function HomeHero({
  caseStudies,
  heading,
  blurb,
}: HomeHeroProps) {
  const ArticleCard = ({
    slug,
    title,
    client,
    role,
    featuredMedia,
  }: {
    slug: string;
    title: string;
    client: string;
    role: string;
    featuredMedia: any;
  }) => {
    const formatedClient = client
      ? client.map((c) => c.name)?.join(" & ")
      : null;
    const formatedRole = role ? role?.join(", ") : null;

    return (
      <li class="shrink-0">
        <article>
          <A href={slug?.fullUrl} class="block h-full w-300">
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

  return (
    <div class="fixed flex h-screen w-full flex-col justify-between overflow-hidden pb-19 max-lg:pt-50">
      <header class="px-margin-1 mx-auto flex h-full items-start justify-center text-center lg:w-[42%] lg:items-center lg:pt-50">
        <div class="">
          <Show when={heading}>
            <h1 class="font-display lg:text-32 text-[2.6rem] leading-[1.2]">
              {heading}
            </h1>
          </Show>
          <Show when={blurb}>
            <p class="text-14 lg:text-18 mt-12">{blurb}</p>
          </Show>
        </div>
      </header>
      <ul class="flex items-end gap-x-18">
        <For each={caseStudies}>
          {(caseStudy) => {
            return <ArticleCard {...caseStudy} />;
          }}
        </For>
      </ul>
    </div>
  );
}
