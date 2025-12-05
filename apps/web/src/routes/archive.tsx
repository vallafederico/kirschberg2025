import { getDocumentByType, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import Media from "~/components/Media";
import { SLICE_LIST } from "~/components/slices";

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create columns where each column contains all items, randomized independently
function createColumns<T>(items: T[], numColumns: number): T[][] {
  if (!items || items.length === 0)
    return Array(numColumns)
      .fill(null)
      .map(() => []);

  // Create columns array, each column gets all items but shuffled independently
  const columns: T[][] = Array(numColumns)
    .fill(null)
    .map(() => shuffleArray(items));

  return columns;
}

const getArchiveData = query(async () => {
  "use server";
  const [page, archiveItems] = await Promise.all([
    getDocumentByType("archive"),
    getDocumentByType("archive-item", { extraQuery: "{...}" }),
  ]);

  // console.log("Archive page:", page);
  // console.log("Archive items:", archiveItems);

  return { page, archiveItems };
}, "archive-data");

export default function ArchivePage() {
  const data = createAsync(() => getArchiveData());

  return (
    <Show when={data()} keyed>
      {(archiveData) => {
        const { page, archiveItems } = archiveData;
        // Mobile: 3 columns, Desktop: 7 columns
        const mobileColumns = createMemo(() => {
          if (!archiveItems || archiveItems.length === 0) return [] as any[][];
          return createColumns<any>(archiveItems, 3);
        });
        const desktopColumns = createMemo(() => {
          if (!archiveItems || archiveItems.length === 0) return [] as any[][];
          return createColumns<any>(archiveItems, 7);
        });

        return (
          <>
            {page && <SanityMeta pageData={page} />}

            {/* Page content - centered container */}
            {/* <div class="px-margin-1 lg:w-grid-5 mx-auto">
              <div class="flex w-full flex-col gap-y-34 pb-50 lg:pb-120">
                {page?.slices && (
                  <SanityComponents
                    components={page.slices}
                    componentList={SLICE_LIST}
                  />
                )}
              </div>
            </div> */}

            {/* Archive items - full width, outside container */}
            <Show when={archiveItems && archiveItems.length > 0}>
              {/* Mobile: 3-column grid */}
              <div class="px-margin-1 grid grid-cols-3 gap-12 overflow-clip lg:hidden">
                <For each={mobileColumns()}>
                  {(column) => (
                    <ul class="flex flex-col gap-12">
                      <For each={column}>
                        {(item) => (
                          <li>
                            <article class="flex flex-col gap-12">
                              <Show when={item.featuredMedia}>
                                <div class="aspect-[.6/1] overflow-hidden rounded-md">
                                  <Media
                                    {...item.featuredMedia}
                                    imageProps={{
                                      desktopWidth: 100,
                                      mobileWidth: 100,
                                    }}
                                    class="h-full w-full object-cover"
                                  />
                                </div>
                              </Show>
                              <div class="flex flex-col gap-4">
                                <Show when={item.link}>
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-14 mt-4 text-blue-600 hover:underline"
                                  >
                                    View Project →
                                  </a>
                                </Show>
                              </div>
                            </article>
                          </li>
                        )}
                      </For>
                    </ul>
                  )}
                </For>
              </div>

              {/* Desktop: 7-column grid */}
              <div class="lg:px-margin-1 hidden w-full lg:grid lg:grid-cols-7 lg:gap-12">
                <For each={desktopColumns()}>
                  {(column) => (
                    <ul class="flex flex-col gap-12">
                      <For each={column}>
                        {(item) => (
                          <li>
                            <article class="flex flex-col gap-12">
                              <Show when={item.featuredMedia}>
                                <div class="aspect-[.6/1] overflow-hidden rounded-md">
                                  <Media
                                    {...item.featuredMedia}
                                    imageProps={{
                                      desktopWidth: 100,
                                      mobileWidth: 100,
                                    }}
                                    class="h-full w-full object-cover"
                                  />
                                </div>
                              </Show>
                              <div class="flex flex-col gap-4">
                                <Show when={item.link}>
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-14 mt-4 text-blue-600 hover:underline"
                                  >
                                    View Project →
                                  </a>
                                </Show>
                              </div>
                            </article>
                          </li>
                        )}
                      </For>
                    </ul>
                  )}
                </For>
              </div>
            </Show>
          </>
        );
      }}
    </Show>
  );
}
