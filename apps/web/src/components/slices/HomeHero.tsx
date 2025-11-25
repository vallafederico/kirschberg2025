import { Show } from "solid-js";
import HeroSlider from "~/components/HeroSlider";

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

      <HeroSlider caseStudies={caseStudies} />
    </div>
  );
}
