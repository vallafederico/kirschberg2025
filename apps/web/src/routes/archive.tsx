import { getDocumentByType, SanityComponents, SanityPage } from "@local/sanity";
import { SanityMeta } from "@local/seo";
import { createAsync, query, useSearchParams } from "@solidjs/router";
import {
  For,
  Show,
  createMemo,
  onMount,
  createSignal,
  onCleanup,
  createEffect,
} from "solid-js";
import VirtualScroll from "virtual-scroll";
import ArchiveCard from "~/components/ArchiveCard";
import ArchiveOverlay from "~/components/ArchiveOverlay";
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

// Generate random scroll speed and direction for each column
function getColumnScrollConfig(index: number, numColumns: number) {
  // Random speed multiplier between 0.5x and 2x
  const speedMultiplier = 0.5 + Math.random() * 1.5;
  // Fully random direction
  const direction = Math.random() > 0.5 ? 1 : -1;

  return {
    speedMultiplier,
    direction,
  };
}

// Column data structure
interface ColumnData {
  ref: HTMLUListElement | undefined;
  items: any[];
  config: { speedMultiplier: number; direction: number };
  singleSetHeight: number;
  offset: number;
  targetOffset: number; // Smooth interpolation target
  currentSetIndex: number; // 0 = showing original, -1 = showing duplicate before, 1 = showing duplicate after
}

// Scrollable column component
function ScrollableColumn({
  items,
  gap = "gap-4",
  onMount: onColumnMount,
  ready,
  onImageClick,
}: {
  items: any[];
  gap?: string;
  onMount: (ref: HTMLUListElement, items: any[]) => (() => void) | void;
  ready: () => boolean;
  onImageClick?: (item: any) => void;
}) {
  let columnRef: HTMLUListElement | undefined;
  // Structure: [duplicate before] [original] [duplicate after]
  const [displayItems, setDisplayItems] = createSignal([
    ...items, // duplicate before
    ...items, // original
    ...items, // duplicate after
  ]);
  let cleanupFn: (() => void) | void;

  onMount(() => {
    if (columnRef) {
      cleanupFn = onColumnMount(columnRef, items);
    }
  });

  onCleanup(() => {
    if (cleanupFn && typeof cleanupFn === "function") {
      cleanupFn();
    }
  });

  return (
    <div class="h-full w-full overflow-hidden">
      <ul
        ref={columnRef}
        class={`flex flex-col ${gap}`}
        // style={{
        //   "will-change": "transform",
        // }}
      >
        <For each={displayItems()}>
          {(item, index) => {
            // Get the correct item from original items array using modulo
            // displayItems is [items, items, items], so we use index % items.length
            // to map back to the original item in the column
            const itemIndex = index() % items.length;
            const correctItem = items[itemIndex];
            
            return (
              <li data-item-index={index()}>
                <ArchiveCard
                  item={correctItem}
                  index={index()}
                  ready={ready()}
                  onImageClick={() => {
                    // Use the same item we're displaying to ensure consistency
                    const clickedId = correctItem?._id || "no-id";
                    const clickedTitle = correctItem?.title || "no-title";
                    const clickedMedia = correctItem?.featuredMedia;
                    console.log("[Archive] Clicked item - ID:", clickedId, "Title:", clickedTitle);
                    console.log("[Archive] Clicked featuredMedia:", clickedMedia);
                    console.log("[Archive] Clicked image asset ID:", clickedMedia?.image?.asset?._id || clickedMedia?.image?._id || "no-image-id");
                    onImageClick?.(correctItem);
                  }}
                />
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [columns, setColumns] = createSignal<ColumnData[]>([]);
  const [columnsReady, setColumnsReady] = createSignal(false);
  const [selectedItem, setSelectedItem] = createSignal<{
    _id?: string;
    featuredMedia?: any;
    link?: string;
  } | null>(null);
  let virtualScroll: VirtualScroll | null = null;
  let readyTimeout: ReturnType<typeof setTimeout> | null = null;

  // Reset columns ready state when data changes
  createEffect(() => {
    if (data()) {
      setColumnsReady(false);
      // Clear any existing timeout
      if (readyTimeout) {
        clearTimeout(readyTimeout);
        readyTimeout = null;
      }
    }
  });

  // Debug: Log when columnsReady changes
  createEffect(() => {
    console.log("[Archive] columnsReady changed to:", columnsReady());
  });

  // Handle query param on mount - open overlay if item param exists
  createEffect(() => {
    const archiveData = data();
    const itemId = searchParams.item;

    if (archiveData?.archiveItems && itemId) {
      const item = archiveData.archiveItems.find((i: any) => i._id === itemId);
      if (item) {
        console.log("[Archive] Opening overlay from URL param:", itemId);
        setSelectedItem(item);
      }
    }
  });

  // Update URL when selected item changes
  createEffect(() => {
    const item = selectedItem();
    if (item?._id) {
      // Add item to query params
      setSearchParams({ item: item._id });
    } else {
      // Remove item from query params
      setSearchParams({ item: undefined });
    }
  });

  // Single virtual-scroll listener for all columns
  onMount(() => {
    // Initialize virtual-scroll to handle all scroll events (wheel, touch, trackpad)
    virtualScroll = new VirtualScroll({
      el: window,
      firefoxMultiplier: 50,
      mouseMultiplier: 0.4, // Reduced from 1 for slower scroll
      touchMultiplier: 0.8, // Reduced from 2 for slower scroll
      passive: true,
    });

    virtualScroll.on((event) => {
      // Close overlay if open when user scrolls (only if not triggered by initial load)
      if (selectedItem() && columnsReady()) {
        setSelectedItem(null);
      }

      // Get current columns
      const currentColumns = columns();
      if (currentColumns.length === 0) return;

      // event.deltaY is the scroll delta from virtual-scroll
      const deltaY = event.deltaY;

      // Update all columns based on scroll delta
      currentColumns.forEach((col: ColumnData) => {
        if (!col.ref || col.singleSetHeight === 0) return;

        // Apply speed multiplier and direction (reduced for slower scroll)
        const adjustedDelta =
          deltaY * col.config.speedMultiplier * col.config.direction * 0.5;
        col.targetOffset += adjustedDelta;

        // Don't wrap here - let the animation loop handle it
        // This prevents jumps when targetOffset wraps but offset hasn't caught up
      });
    });

    // Smooth animation loop using requestAnimationFrame
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      const currentColumns = columns();
      currentColumns.forEach((col: ColumnData) => {
        if (!col.ref || col.singleSetHeight === 0) return;

        const setHeight = col.singleSetHeight;

        // Wrap both offset and targetOffset to stay in a reasonable range
        // This prevents them from growing infinitely
        if (setHeight > 0) {
          // Normalize targetOffset to be within [-setHeight * 2, 0]
          while (col.targetOffset <= -setHeight * 2) {
            col.targetOffset += setHeight;
            col.offset += setHeight;
          }
          while (col.targetOffset >= 0) {
            col.targetOffset -= setHeight;
            col.offset -= setHeight;
          }
        }

        // Smoothly lerp towards target
        col.offset = lerp(col.offset, col.targetOffset, 0.08);

        // Update transform
        col.ref.style.transform = `translateY(${col.offset}px)`;
      });

      requestAnimationFrame(animate);
    };

    // Start animation loop
    requestAnimationFrame(animate);

    onCleanup(() => {
      if (virtualScroll) {
        virtualScroll.destroy();
        virtualScroll = null;
      }
    });
  });

  // Helper to calculate and store column data
  const registerColumn = (
    ref: HTMLUListElement,
    items: any[],
    config: { speedMultiplier: number; direction: number },
  ) => {
    const updateHeights = () => {
      const children = Array.from(ref.children) as HTMLElement[];

      if (children.length === 0 || items.length === 0) return;

      // Calculate height of one set (original items, not duplicated)
      // Get the total height from first to last item of the first set, including gaps
      let oneSetHeight = 0;
      if (children.length >= items.length) {
        const firstItem = children[0] as HTMLElement;
        const lastItem = children[items.length - 1] as HTMLElement;
        const firstRect = firstItem.getBoundingClientRect();
        const lastRect = lastItem.getBoundingClientRect();
        oneSetHeight = lastRect.bottom - firstRect.top;
      }

      // Fallback: sum of heights if bounding rect method doesn't work
      if (oneSetHeight === 0 || oneSetHeight < 100) {
        const heights = children.map((child) => child.offsetHeight);
        oneSetHeight = heights
          .slice(0, items.length)
          .reduce((sum, h) => sum + h, 0);
      }

      if (oneSetHeight > 0) {
        // Update or add column data
        const existingIndex = columns().findIndex(
          (c: ColumnData) => c.ref === ref,
        );

        // Add random initial offset within one set's range for visual variety
        // Random value between 0 and 1, applied to the set height
        const randomOffsetFactor = Math.random();
        const initialOffset = -oneSetHeight - randomOffsetFactor * oneSetHeight;

        const columnData: ColumnData = {
          ref,
          items,
          config,
          singleSetHeight: oneSetHeight,
          // Start with random offset within valid range [-oneSetHeight * 2, -oneSetHeight]
          // This creates visual variety in the initial grid layout
          offset: initialOffset,
          targetOffset: initialOffset, // Initialize target to match offset
          currentSetIndex: 0,
        };

        // Set initial transform with random offset
        if (ref) {
          ref.style.transform = `translateY(${initialOffset}px)`;
        }

        if (existingIndex >= 0) {
          const updated = [...columns()];
          updated[existingIndex] = columnData;
          setColumns(updated);
        } else {
          setColumns([...columns(), columnData]);
        }
      }
    };

    // Try multiple times to ensure heights are calculated
    setTimeout(updateHeights, 50);
    setTimeout(updateHeights, 200);
    setTimeout(() => {
      updateHeights();
      // After the last positioning attempt (500ms), wait a bit more then mark as ready
      // Clear any existing timeout and set a new one
      if (readyTimeout) {
        clearTimeout(readyTimeout);
      }
      // Wait 100ms after the last positioning attempt to ensure all columns are positioned
      readyTimeout = setTimeout(() => {
        console.log("[Archive] Setting columnsReady to true");
        setColumnsReady(true);
        readyTimeout = null;
      }, 100);
    }, 500);

    const resizeObserver = new ResizeObserver(updateHeights);
    resizeObserver.observe(ref);

    return () => {
      resizeObserver.disconnect();
      // Remove column on cleanup
      setColumns(columns().filter((c: ColumnData) => c.ref !== ref));
    };
  };

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
              <div class="px-margin-1 grid grid-cols-3 gap-12 overflow-hidden lg:hidden">
                <For each={mobileColumns()}>
                  {(column, index) => {
                    const config = getColumnScrollConfig(index(), 3);
                    return (
                      <div class="h-screen overflow-hidden">
                        <ScrollableColumn
                          items={column}
                          gap="gap-12"
                          ready={columnsReady}
                          onMount={(ref) => registerColumn(ref, column, config)}
                          onImageClick={(item) => setSelectedItem(item)}
                        />
                      </div>
                    );
                  }}
                </For>
              </div>

              {/* Desktop: 7-column grid */}
              <div class="lg:px-margin-1 hidden h-screen w-full overflow-hidden lg:grid lg:grid-cols-7 lg:gap-12">
                <For each={desktopColumns()}>
                  {(column, index) => {
                    const config = getColumnScrollConfig(index(), 7);
                    return (
                      <div class="h-full overflow-hidden">
                        <ScrollableColumn
                          items={column}
                          gap="gap-4"
                          ready={columnsReady}
                          onMount={(ref) => registerColumn(ref, column, config)}
                          onImageClick={(item) => setSelectedItem(item)}
                        />
                      </div>
                    );
                  }}
                </For>
              </div>
            </Show>

            {/* Archive Overlay */}
            <ArchiveOverlay
              item={selectedItem()}
              onClose={() => setSelectedItem(null)}
            />
          </>
        );
      }}
    </Show>
  );
}
