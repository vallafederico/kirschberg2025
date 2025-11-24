import { getDocumentByType, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js";
import HomeHero from "~/components/slices/HomeHero";

const getHomeData = query(async () => {
  "use server";

  return await Promise.all([
    getDocumentByType("home"),
    getDocumentByType("case-study", {
      extraQuery: "{title,role,featuredMedia,client{name},slug}",
    }),
  ]);
}, "home-data");

export default function Home(props: RouteSectionProps) {
  const data = createAsync(() => getHomeData());

  return (
    <>
      <SanityPage fetcher={data}>
        {([page, caseStudies]) => {
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
