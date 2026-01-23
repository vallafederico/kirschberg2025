import { getDocumentByType, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query, type RouteSectionProps } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import HomeHero from "~/components/slices/HomeHero";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getHomeData = query(async () => {
  "use server";

  const [home, caseStudies] = await Promise.all([
    getDocumentByType("home"),
    getDocumentByType("case-study", {
      extraQuery:
        "{title,role,featuredMedia,client{name},slug,liveLink,directLink}",
    }),
  ]);

  const shuffled = shuffleArray(caseStudies);
  const firstSet = shuffled.map((item: any) => ({
    ...item,
    duplicated: false,
  }));
  const secondSet = shuffled.map((item: any) => ({
    ...item,
    duplicated: true,
  }));
  return { page: home, caseStudies: [...firstSet, ...secondSet] };
}, "home-data");

export default function Home(props: RouteSectionProps) {
  const data = createAsync(() => getHomeData());

  createEffect(() => {
    console.log(data()?.caseStudies);
  });

  return (
    <>
      <SanityPage fetcher={data}>
        {({ page, caseStudies }) => {
          return (
            <>
              <SanityMeta isHomepage={true} pageData={page} />
              <HomeHero caseStudies={caseStudies} {...page} />
            </>
          );
        }}
      </SanityPage>
      <Show keyed when={props.params.slug}>
        {props.children}
      </Show>
    </>
  );
}
