import { getDocumentByType, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query } from "@solidjs/router";
import { SLICE_LIST } from "~/components/slices";

const getAboutData = query(async () => {
  "use server";

  return await getDocumentByType("about");
}, "about");

export default function AboutPage() {
  const data = createAsync(() => getAboutData());

  return (
    <SanityPage class="px-margin-1 max-w-[580px] mx-auto" fetcher={data}>
      {(page) => {
        return (
          <>
            <SanityMeta pageData={page} />
            <div class="flex flex-col gap-y-34 pb-50 lg:pb-120">
              <SanityComponents
                components={page.slices}
                componentList={SLICE_LIST}
              />
            </div>
          </>
        );
      }}
    </SanityPage>
  );
}
