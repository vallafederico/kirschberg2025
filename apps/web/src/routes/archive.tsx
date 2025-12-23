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
  offsetX: number; // Horizontal offset
  targetOffsetX: number; // Horizontal target offset
  singleSetWidth: number; // Width of one column set
  currentSetIndex: number; // 0 = showing original, -1 = showing duplicate before, 1 = showing duplicate after
  gridCopyIndex: number; // Which grid copy this column belongs to
  positionIndex: number; // Position within grid copy (0-6)
}

// Grid copy data structure - each grid copy (left, center, right) behaves as a unit
interface GridCopyData {
  index: number; // 0, 1, 2 for left, center, right
  offsetY: number; // Shared vertical offset for this grid copy
  targetOffsetY: number; // Shared vertical target for this grid copy
  config: { speedMultiplier: number; direction: number }; // Shared config for this grid copy
}

// Scrollable column component
function ScrollableColumn({
  items,
  gap = "gap-4",
  onMount: onColumnMount,
  ready,
  onImageClick,
  dragThresholdExceeded,
}: {
  items: any[];
  gap?: string;
  onMount: (ref: HTMLUListElement, items: any[]) => (() => void) | void;
  ready: () => boolean;
  onImageClick?: (item: any) => void;
  dragThresholdExceeded: () => boolean;
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
        style={{ "will-change": "transform" }}
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
                    // Only trigger click if drag threshold was not exceeded
                    if (dragThresholdExceeded()) {
                      console.log("[Archive] Ignoring click - was a drag");
                      return;
                    }

                    // Use the same item we're displaying to ensure consistency
                    const clickedId = correctItem?._id || "no-id";
                    const clickedTitle = correctItem?.title || "no-title";
                    const clickedMedia = correctItem?.featuredMedia;
                    console.log(
                      "[Archive] Clicked item - ID:",
                      clickedId,
                      "Title:",
                      clickedTitle,
                    );
                    console.log(
                      "[Archive] Clicked featuredMedia:",
                      clickedMedia,
                    );
                    console.log(
                      "[Archive] Clicked image asset ID:",
                      clickedMedia?.image?.asset?._id ||
                        clickedMedia?.image?._id ||
                        "no-image-id",
                    );
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
  const [gridCopies, setGridCopies] = createSignal<GridCopyData[]>([]);
  const [columnsReady, setColumnsReady] = createSignal(false);
  const [selectedItem, setSelectedItem] = createSignal<{
    _id?: string;
    featuredMedia?: any;
    link?: string;
  } | null>(null);
  let virtualScroll: VirtualScroll | null = null;
  let readyTimeout: ReturnType<typeof setTimeout> | null = null;

  // Drag state for omnidirectional dragging
  let isDragging = false;
  let dragThresholdExceeded = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartOffsetX = 0;
  let dragStartOffsetY = 0;
  let gridContainerRef: HTMLDivElement | null = null;
  let gridWrapperRef: HTMLDivElement | null = null;
  let dragUpdateFrame: number | null = null;

  // Getter function for dragThresholdExceeded to pass to ScrollableColumn
  const getDragThresholdExceeded = () => dragThresholdExceeded;

  // Momentum scrolling state
  let lastDragX = 0;
  let lastDragY = 0;
  let lastDragTime = 0;
  const verticalMomentum = new Map<string, number>(); // position index -> velocity
  const dragStartOffsetsY = new Map<HTMLUListElement, number>(); // column ref -> starting Y offset

  // Drag threshold for distinguishing clicks from drags
  const DRAG_THRESHOLD = 10; // pixels

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
      // Don't handle scroll if dragging
      if (isDragging) return;

      // Clear existing momentum when scrolling starts
      verticalMomentum.clear();

      // Close overlay if open when user scrolls (only if not triggered by initial load)
      if (selectedItem() && columnsReady()) {
        setSelectedItem(null);
      }

      // Get current grid copies
      const currentGridCopies = gridCopies();
      if (currentGridCopies.length === 0) return;

      // event.deltaY is the scroll delta from virtual-scroll
      const deltaY = event.deltaY;

      // Apply scrolling to individual columns for varied speeds
      // But ensure columns in same positions across grid copies behave identically
      const currentColumns = columns();
      currentColumns.forEach((col: ColumnData) => {
        if (!col.ref) return;

        const adjustedDelta = deltaY * col.config.speedMultiplier * col.config.direction * 0.5;
        col.targetOffset += adjustedDelta;

        // Add consistent randomization based on column position within grid
        const positionPhase = col.targetOffset * 0.002;
        const randomWobble = (Math.sin(positionPhase + randomSeed + col.positionIndex) * 0.3 +
                             Math.sin(positionPhase * 1.7 + randomSeed * 2 + col.positionIndex) * 0.2) * 2;
        col.targetOffset += randomWobble;

        // Don't wrap here - let the animation loop handle it
      });

      // Update columns state
      setColumns([...currentColumns]);

      // Update grid copies state
      setGridCopies([...currentGridCopies]);

      // Update grid copies state
      setGridCopies([...currentGridCopies]);
    });

    // Drag handlers for omnidirectional dragging
    const handleMouseDown = (e: MouseEvent) => {
      // Don't start drag if clicking on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-selectable]")
      ) {
        return;
      }

      isDragging = true;
      dragThresholdExceeded = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      lastDragTime = performance.now();

      // Clear any existing momentum
      verticalMomentum.clear();

      // Get current columns and read actual visual positions from DOM
      // This ensures we start dragging from the exact visual position with no jump
      const currentColumns = columns();
      if (currentColumns.length > 0) {
        const firstCol = currentColumns[0];

        // Read horizontal position from grid container
        if (gridContainerRef) {
          const transform = window.getComputedStyle(gridContainerRef).transform;
          if (transform && transform !== "none") {
            const matrix = new DOMMatrix(transform);
            const actualX = matrix.m41; // translateX value
            firstCol.targetOffsetX = actualX;
            firstCol.offsetX = actualX;
            dragStartOffsetX = actualX;
            // Sync all columns' horizontal offset
            currentColumns.forEach((col) => {
              col.targetOffsetX = actualX;
              col.offsetX = actualX;
            });
          } else {
            dragStartOffsetX = firstCol.targetOffsetX || 0;
          }
        } else {
          dragStartOffsetX = firstCol.targetOffsetX || 0;
        }

        // Read vertical positions from each column's ref and store starting position
        currentColumns.forEach((col: ColumnData) => {
          if (col.ref) {
            const transform = window.getComputedStyle(col.ref).transform;
            if (transform && transform !== "none") {
              const matrix = new DOMMatrix(transform);
              const actualY = matrix.m42; // translateY value
              col.targetOffset = actualY;
              col.offset = actualY;
              // Store starting position for this column using ref as key
              dragStartOffsetsY.set(col.ref, actualY);
            } else {
              // Fallback to stored value
              dragStartOffsetsY.set(col.ref, col.targetOffset || 0);
            }
          }
        });

        // Keep dragStartOffsetY for backward compatibility (use first column)
        const firstColRef = currentColumns[0]?.ref;
        dragStartOffsetY = firstColRef
          ? dragStartOffsetsY.get(firstColRef) || 0
          : 0;
      }

      e.preventDefault();
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Throttle updates using requestAnimationFrame
      if (dragUpdateFrame !== null) {
        cancelAnimationFrame(dragUpdateFrame);
      }

      dragUpdateFrame = requestAnimationFrame(() => {
        const deltaX = e.clientX - dragStartX;
        const deltaY = dragStartY - e.clientY;

        // Check if drag threshold exceeded (distinguish clicks from drags)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > DRAG_THRESHOLD && !dragThresholdExceeded) {
          dragThresholdExceeded = true;
        }

        // Track velocity for vertical momentum
        const currentTime = performance.now();
        const timeDelta = currentTime - lastDragTime;
        if (timeDelta > 0) {
          const velocityY = (lastDragY - e.clientY) / timeDelta;
          lastDragY = e.clientY;
          lastDragTime = currentTime;

          // Store momentum for each column position
          const currentColumns = columns();
          const columnsByPosition: { [key: number]: ColumnData[] } = {};
          currentColumns.forEach(col => {
            if (!columnsByPosition[col.positionIndex]) {
              columnsByPosition[col.positionIndex] = [];
            }
            columnsByPosition[col.positionIndex].push(col);
          });

          Object.keys(columnsByPosition).forEach(posKey => {
            const position = parseInt(posKey);
            const positionColumns = columnsByPosition[position];
            const firstCol = positionColumns[0];

            if (firstCol && firstCol.singleSetHeight > 0) {
              const adjustedVelocity = velocityY * firstCol.config.speedMultiplier * firstCol.config.direction * 0.5;
              verticalMomentum.set(`momentum-pos-${position}`, adjustedVelocity);
            }
          });
        }

        const currentColumns = columns();
        if (currentColumns.length === 0) {
          dragUpdateFrame = null;
          return;
        }

        const firstCol = currentColumns[0];
        const setWidth = firstCol?.singleSetWidth || 0;

        // Calculate new horizontal target positions
        let newTargetX = dragStartOffsetX + deltaX;
        let wrapAdjustment = 0;

        // Clamp horizontal target to valid range and calculate wrap adjustment
        if (setWidth > 0) {
          if (newTargetX <= -setWidth * 2) {
            wrapAdjustment = setWidth;
            newTargetX += wrapAdjustment;
            dragStartOffsetX += wrapAdjustment;
          } else if (newTargetX > 0) {
            wrapAdjustment = -setWidth;
            newTargetX += wrapAdjustment;
            dragStartOffsetX += wrapAdjustment;
          }
        }

        // Apply horizontal drag to all columns
        currentColumns.forEach((col: ColumnData) => {
          if (!col.ref) return;

          if (wrapAdjustment !== 0) {
            col.offsetX += wrapAdjustment;
            col.targetOffsetX += wrapAdjustment;
          }

          col.targetOffsetX = newTargetX;
        });

        // Apply vertical drag to columns by position
        const columnsByPosition: { [key: number]: ColumnData[] } = {};
        currentColumns.forEach(col => {
          if (!columnsByPosition[col.positionIndex]) {
            columnsByPosition[col.positionIndex] = [];
          }
          columnsByPosition[col.positionIndex].push(col);
        });

        Object.keys(columnsByPosition).forEach(posKey => {
          const position = parseInt(posKey);
          const positionColumns = columnsByPosition[position];
          const firstCol = positionColumns[0];

          if (firstCol) {
            const colStartY = dragStartOffsetsY.get(firstCol.ref) || dragStartOffsetY;
            const adjustedDeltaY = deltaY * firstCol.config.speedMultiplier * firstCol.config.direction * 0.5;
            const newTargetY = colStartY + adjustedDeltaY;

            positionColumns.forEach(col => {
              col.targetOffset = newTargetY;
            });
          }
        });

        dragUpdateFrame = null;
      });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      isDragging = false;
      if (dragUpdateFrame !== null) {
        cancelAnimationFrame(dragUpdateFrame);
        dragUpdateFrame = null;
      }

      // Small delay to allow click events to fire if it was a genuine click
      setTimeout(() => {
        dragThresholdExceeded = false;
      }, 10);

      // Momentum is already stored in verticalMomentum map
      // It will be applied in the animation loop

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-selectable]")
      ) {
        return;
      }

      isDragging = true;
      dragThresholdExceeded = false;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      lastDragX = e.touches[0].clientX;
      lastDragY = e.touches[0].clientY;
      lastDragTime = performance.now();

      // Clear any existing momentum
      verticalMomentum.clear();

      // Get current columns and read actual visual positions from DOM
      // This ensures we start dragging from the exact visual position with no jump
      const currentColumns = columns();
      if (currentColumns.length > 0) {
        const firstCol = currentColumns[0];

        // Read horizontal position from grid container
        if (gridContainerRef) {
          const transform = window.getComputedStyle(gridContainerRef).transform;
          if (transform && transform !== "none") {
            const matrix = new DOMMatrix(transform);
            const actualX = matrix.m41; // translateX value
            firstCol.targetOffsetX = actualX;
            firstCol.offsetX = actualX;
            dragStartOffsetX = actualX;
            // Sync all columns' horizontal offset
            currentColumns.forEach((col) => {
              col.targetOffsetX = actualX;
              col.offsetX = actualX;
            });
          } else {
            dragStartOffsetX = firstCol.targetOffsetX || 0;
          }
        } else {
          dragStartOffsetX = firstCol.targetOffsetX || 0;
        }

        // Read vertical positions from each column's ref and store starting position
        currentColumns.forEach((col: ColumnData) => {
          if (col.ref) {
            const transform = window.getComputedStyle(col.ref).transform;
            if (transform && transform !== "none") {
              const matrix = new DOMMatrix(transform);
              const actualY = matrix.m42; // translateY value
              col.targetOffset = actualY;
              col.offset = actualY;
              // Store starting position for this column using ref as key
              dragStartOffsetsY.set(col.ref, actualY);
            } else {
              // Fallback to stored value
              dragStartOffsetsY.set(col.ref, col.targetOffset || 0);
            }
          }
        });

        // Keep dragStartOffsetY for backward compatibility (use first column)
        const firstColRef = currentColumns[0]?.ref;
        dragStartOffsetY = firstColRef
          ? dragStartOffsetsY.get(firstColRef) || 0
          : 0;
      }

      e.preventDefault();
      document.body.style.userSelect = "none";
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;

      // Throttle updates using requestAnimationFrame
      if (dragUpdateFrame !== null) {
        cancelAnimationFrame(dragUpdateFrame);
      }

      dragUpdateFrame = requestAnimationFrame(() => {
        const deltaX = e.touches[0].clientX - dragStartX;
        const deltaY = dragStartY - e.touches[0].clientY;

        // Check if drag threshold exceeded (distinguish clicks from drags)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > DRAG_THRESHOLD && !dragThresholdExceeded) {
          dragThresholdExceeded = true;
        }

        // Track velocity for vertical momentum
        const currentTime = performance.now();
        const timeDelta = currentTime - lastDragTime;
        if (timeDelta > 0) {
          const velocityY = (lastDragY - e.touches[0].clientY) / timeDelta;
          lastDragY = e.touches[0].clientY;
          lastDragTime = currentTime;

          // Store momentum for each column position
          const currentColumns = columns();
          const columnsByPosition: { [key: number]: ColumnData[] } = {};
          currentColumns.forEach(col => {
            if (!columnsByPosition[col.positionIndex]) {
              columnsByPosition[col.positionIndex] = [];
            }
            columnsByPosition[col.positionIndex].push(col);
          });

          Object.keys(columnsByPosition).forEach(posKey => {
            const position = parseInt(posKey);
            const positionColumns = columnsByPosition[position];
            const firstCol = positionColumns[0];

            if (firstCol && firstCol.singleSetHeight > 0) {
              const adjustedVelocity = velocityY * firstCol.config.speedMultiplier * firstCol.config.direction * 0.5;
              verticalMomentum.set(`momentum-pos-${position}`, adjustedVelocity);
            }
          });
        }

        const currentColumns = columns();
        if (currentColumns.length === 0) {
          dragUpdateFrame = null;
          return;
        }

        const firstCol = currentColumns[0];
        const setWidth = firstCol?.singleSetWidth || 0;

        // Calculate new horizontal target positions
        let newTargetX = dragStartOffsetX + deltaX;
        let wrapAdjustment = 0;

        // Clamp horizontal target to valid range and calculate wrap adjustment
        if (setWidth > 0) {
          if (newTargetX <= -setWidth * 2) {
            wrapAdjustment = setWidth;
            newTargetX += wrapAdjustment;
            dragStartOffsetX += wrapAdjustment;
          } else if (newTargetX > 0) {
            wrapAdjustment = -setWidth;
            newTargetX += wrapAdjustment;
            dragStartOffsetX += wrapAdjustment;
          }
        }

        // Apply horizontal drag to all columns
        currentColumns.forEach((col: ColumnData) => {
          if (!col.ref) return;

          if (wrapAdjustment !== 0) {
            col.offsetX += wrapAdjustment;
            col.targetOffsetX += wrapAdjustment;
          }

          col.targetOffsetX = newTargetX;
        });

        // Apply vertical drag to columns by position
        const columnsByPosition: { [key: number]: ColumnData[] } = {};
        currentColumns.forEach(col => {
          if (!columnsByPosition[col.positionIndex]) {
            columnsByPosition[col.positionIndex] = [];
          }
          columnsByPosition[col.positionIndex].push(col);
        });

        Object.keys(columnsByPosition).forEach(posKey => {
          const position = parseInt(posKey);
          const positionColumns = columnsByPosition[position];
          const firstCol = positionColumns[0];

          if (firstCol) {
            const colStartY = dragStartOffsetsY.get(firstCol.ref) || dragStartOffsetY;
            const adjustedDeltaY = deltaY * firstCol.config.speedMultiplier * firstCol.config.direction * 0.5;
            const newTargetY = colStartY + adjustedDeltaY;

            positionColumns.forEach(col => {
              col.targetOffset = newTargetY;
            });
          }
        });

        dragUpdateFrame = null;
      });

      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      isDragging = false;
      if (dragUpdateFrame !== null) {
        cancelAnimationFrame(dragUpdateFrame);
        dragUpdateFrame = null;
      }

      // Small delay to allow click events to fire if it was a genuine click
      setTimeout(() => {
        dragThresholdExceeded = false;
      }, 10);

      document.body.style.userSelect = "";
    };

    // Add event listeners to grid containers
    const addDragListeners = () => {
      const container = gridContainerRef || gridWrapperRef;
      if (!container) return;

      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mouseleave", handleMouseUp);

      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("touchcancel", handleTouchEnd);
    };

    // Remove event listeners
    const removeDragListeners = () => {
      const container = gridContainerRef || gridWrapperRef;
      if (!container) return;

      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseUp);

      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };

    // Set up drag listeners after a short delay to ensure grid is rendered
    setTimeout(addDragListeners, 100);

    // Animation loop - no lerping, direct value assignment
    const animate = () => {
      const currentColumns = columns();
      if (currentColumns.length === 0) {
        requestAnimationFrame(animate);
        return;
      }

      // Get the first column's width for horizontal wrapping
      const firstCol = currentColumns[0];
      const setWidth = firstCol?.singleSetWidth || 0;

      // Apply horizontal transform to the grid container (all columns move together)
      // We have 3 copies of the grid: [left] [center] [right]
      // Valid range: [-2*setWidth, 0] to stay within the 3 copies
      if (gridContainerRef && setWidth > 0) {
        let sharedOffsetX = firstCol?.targetOffsetX || 0;
        let wrapAdjustment = 0;

        // Check and wrap horizontal target if needed
        if (sharedOffsetX <= -setWidth * 2) {
          wrapAdjustment = setWidth;
          sharedOffsetX += wrapAdjustment;
          dragStartOffsetX += wrapAdjustment; // Update drag start to match wrap
        } else if (sharedOffsetX > 0) {
          wrapAdjustment = -setWidth;
          sharedOffsetX += wrapAdjustment;
          dragStartOffsetX += wrapAdjustment; // Update drag start to match wrap
        }

        // Set offset directly to target (no lerping)
        const sharedOffset = sharedOffsetX;

        // Apply transform using translate3d for hardware acceleration
        gridContainerRef.style.transform = `translate3d(${sharedOffset}px, 0, 0)`;

        // Update all columns' offsetX and targetOffsetX to match (they're always in sync now)
        // Also update grid copies' offsets if we wrapped
        currentColumns.forEach((col) => {
          // If we wrapped, update both offset and targetOffset to prevent jump
          if (wrapAdjustment !== 0) {
            col.offsetX += wrapAdjustment;
            // Also update the corresponding grid copy's offset
            const gridCopy = gridCopies().find(gc => Math.abs(gc.offsetY - col.offset) < 1);
            if (gridCopy) {
              gridCopy.offsetY += wrapAdjustment;
              gridCopy.targetOffsetY += wrapAdjustment;
            }
          }
          col.offsetX = sharedOffset;
          col.targetOffsetX = sharedOffsetX;
        });
      }

      // Update individual columns with their own scrolling and wrapping
      const setHeight = currentColumns[0]?.singleSetHeight || 0;
      if (setHeight === 0) return;

      // Apply momentum to columns by position (all columns in same position share momentum)
      if (!isDragging) {
        // Group by position index
        const columnsByPosition: { [key: number]: ColumnData[] } = {};
        currentColumns.forEach(col => {
          if (!col.ref) return;
          if (!columnsByPosition[col.positionIndex]) {
            columnsByPosition[col.positionIndex] = [];
          }
          columnsByPosition[col.positionIndex].push(col);
        });

        // Apply momentum to each position group
        Object.keys(columnsByPosition).forEach(posKey => {
          const position = parseInt(posKey);
          const positionColumns = columnsByPosition[position];
          const momentumKey = `momentum-pos-${position}`;

          if (verticalMomentum.has(momentumKey)) {
            const momentum = verticalMomentum.get(momentumKey)!;
            const frameTime = 16.67;
            const momentumDelta = momentum * frameTime * 0.8;

            positionColumns.forEach(col => {
              col.targetOffset += momentumDelta;
            });

            const newMomentum = momentum * 0.97;
            if (Math.abs(newMomentum) < 0.005) {
              verticalMomentum.delete(momentumKey);
            } else {
              verticalMomentum.set(momentumKey, newMomentum);
            }
          }
        });
      }

      // Apply vertical wrapping to individual columns
      currentColumns.forEach((col: ColumnData) => {
        if (col.targetOffset <= -setHeight * 2) {
          col.targetOffset += setHeight;
        } else if (col.targetOffset > 0) {
          col.targetOffset -= setHeight;
        }
        col.offset = col.targetOffset;
      });

      // Apply transforms to all columns
      currentColumns.forEach((col: ColumnData) => {
        if (col.ref) {
          col.ref.style.transform = `translate3d(0, ${col.offset}px, 0)`;
        }
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
      removeDragListeners();
    });
  });

  // Shared config for all grid copies - same randomization for seamless wrapping
  let sharedGridConfig: { speedMultiplier: number; direction: number } | null = null;

  // Shared configs for columns - ensures columns in same positions across grid copies behave identically
  let columnConfigs: Array<{ speedMultiplier: number; direction: number }> = [];

  // Shared scroll state for consistent randomization
  let sharedScrollOffset = 0;
  let randomSeed = Math.random() * 1000;

  // Helper to calculate and store column data
  const registerColumn = (
    ref: HTMLUListElement,
    items: any[],
    config: { speedMultiplier: number; direction: number },
    gridCopyIndex: number,
    columnIndex: number,
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
        // Get or create grid copy data
        const currentGridCopies = gridCopies();
        let gridCopy = currentGridCopies.find(gc => gc.index === gridCopyIndex);

        if (!gridCopy) {
          // Create shared config for all grid copies if not exists
          if (!sharedGridConfig) {
            sharedGridConfig = {
              speedMultiplier: 0.5 + Math.random() * 1.5,
              direction: Math.random() > 0.5 ? 1 : -1,
            };
          }

          // All grid copies use the SAME config and initial offset for seamless wrapping
          const initialOffsetY = -oneSetHeight;

          gridCopy = {
            index: gridCopyIndex,
            offsetY: initialOffsetY,
            targetOffsetY: initialOffsetY,
            config: sharedGridConfig, // Same config for all grid copies
          };
          setGridCopies([...currentGridCopies, gridCopy]);
        }

        // Calculate grid width (one set = full viewport width)
        let oneSetWidth = 0;
        if (gridWrapperRef) {
          const gridRect = gridWrapperRef.getBoundingClientRect();
          oneSetWidth = gridRect.width; // One set is the full viewport width
        }

        // Calculate initial horizontal offset to center on middle copy
        const initialOffsetX = oneSetWidth > 0 ? -oneSetWidth : 0;

        // Ensure we have a config for this column position
        if (!columnConfigs[columnIndex]) {
          columnConfigs[columnIndex] = {
            speedMultiplier: 0.3 + Math.random() * 0.7,
            direction: Math.random() > 0.5 ? 1 : -1,
          };
        }

        const columnData: ColumnData = {
          ref,
          items,
          config: columnConfigs[columnIndex], // Use shared config for this column position
          singleSetHeight: oneSetHeight,
          singleSetWidth: oneSetWidth,
          // Start with grid copy's offset, but will scroll independently
          offset: gridCopy.offsetY,
          targetOffset: gridCopy.targetOffsetY,
          offsetX: initialOffsetX,
          targetOffsetX: initialOffsetX,
          currentSetIndex: 0,
          gridCopyIndex: gridCopyIndex,
          positionIndex: columnIndex, // Store position within grid
        };

        // Set initial transform using grid copy's offset
        if (ref) {
          ref.style.transform = `translate3d(0, ${gridCopy.offsetY}px, 0)`;
        }

        // Set initial horizontal transform on grid container (only once, when first column is registered)
        if (gridContainerRef && columns().length === 0 && oneSetWidth > 0) {
          gridContainerRef.style.transform = `translate3d(${initialOffsetX}px, 0, 0)`;
        }

        // Update or add column data
        const existingIndex = columns().findIndex(
          (c: ColumnData) => c.ref === ref,
        );

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
              {/* Mobile: 3-column grid with horizontal duplication */}
              <div
                ref={(el) => {
                  gridWrapperRef = el;
                }}
                class="relative h-screen w-full overflow-hidden lg:hidden"
                style={{ cursor: isDragging ? "grabbing" : "move" }}
              >
                {/* Three copies of the grid for seamless horizontal looping */}
                <div
                  ref={(el) => {
                    gridContainerRef = el;
                  }}
                  class="absolute top-0 left-0 flex h-full w-[300%]"
                  style={{ "will-change": "transform" }}
                >
                  <For each={[0, 1, 2]}>
                    {(gridCopyIndex) => (
                      <div class="grid h-full w-1/3 grid-cols-3 gap-12 pr-6 pl-6">
                        <For each={mobileColumns()}>
                          {(column, index) => {
                            const config = getColumnScrollConfig(index(), 3);
                            return (
                              <div class="h-full overflow-hidden">
                                <ScrollableColumn
                                  items={column}
                                  gap="gap-12"
                                  ready={columnsReady}
                                  onMount={(ref) =>
                                    registerColumn(ref, column, config, gridCopyIndex, index())
                                  }
                                  onImageClick={(item) => setSelectedItem(item)}
                                  dragThresholdExceeded={getDragThresholdExceeded}
                                />
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Desktop: 7-column grid with horizontal duplication */}
              <div
                ref={(el) => {
                  gridWrapperRef = el;
                }}
                class="relative hidden h-screen w-full overflow-hidden lg:block"
                style={{ cursor: isDragging ? "grabbing" : "move" }}
              >
                {/* Three copies of the grid for seamless horizontal looping */}
                <div
                  ref={(el) => {
                    gridContainerRef = el;
                  }}
                  class="absolute top-0 left-0 flex h-full w-[300%]"
                  style={{ "will-change": "transform" }}
                >
                  <For each={[0, 1, 2]}>
                    {(gridCopyIndex) => (
                      <div class="grid h-full w-1/3 grid-cols-7 gap-12 pr-6 pl-6">
                        <For each={desktopColumns()}>
                          {(column, index) => {
                            const config = getColumnScrollConfig(index(), 7);
                            return (
                              <div class="h-full overflow-hidden">
                                <ScrollableColumn
                                  items={column}
                                  gap="gap-4"
                                  ready={columnsReady}
                                  onMount={(ref) =>
                                    registerColumn(ref, column, config, gridCopyIndex, index())
                                  }
                                  onImageClick={(item) => setSelectedItem(item)}
                                  dragThresholdExceeded={getDragThresholdExceeded}
                                />
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    )}
                  </For>
                </div>
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
