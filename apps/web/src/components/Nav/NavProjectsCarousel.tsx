import { getDocumentByType } from "@local/sanity";
import { A, createAsync, query } from "@solidjs/router";
import gsap from "gsap";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { navStore } from "~/lib/stores/navStore";
import Media from "../Media";

const getProjects = query(async () => {
  "use server";

  const MAX_PROJECTS = 10; // Maximum number of projects to show in carousel

  // Get featured case studies (showInNav == true), ordered by creation date (latest first)
  // Using defined() to handle cases where the field might not exist yet
  // Exclude hidden case studies
  const featured = await getDocumentByType("case-study", {
    filter: "&& defined(showInNav) && showInNav == true && (!defined(hidden) || hidden != true)",
    extraQuery:
      "| order(_createdAt desc){title,byline,slug,'thumbnail':featuredMedia[0],showInNav,_id,liveLink,directLink}",
  });

  // If we have enough featured projects, return them
  if (featured.length >= MAX_PROJECTS) {
    return featured.slice(0, MAX_PROJECTS);
  }

  // Otherwise, get the latest non-featured case studies to fill up to MAX_PROJECTS
  const remaining = MAX_PROJECTS - featured.length;
  const featuredIds =
    featured.length > 0 ? featured.map((p: any) => p._id) : [];

  // Build filter to exclude featured projects and hidden case studies
  const excludeFilter =
    featuredIds.length > 0
      ? `&& !(_id in [${featuredIds.map((id: string) => `"${id}"`).join(",")}])`
      : "";

  const latest = await getDocumentByType("case-study", {
    filter: `${excludeFilter} && (!defined(hidden) || hidden != true)`,
    extraQuery: `| order(_createdAt desc)[0...${remaining}]{title,byline,slug,'thumbnail':featuredMedia[0],showInNav,_id,liveLink,directLink}`,
  });

  // Combine: featured first, then latest
  return [...featured, ...latest];
}, "projects");

export default function NavProjectsCarousel() {
  let interval: ReturnType<typeof setInterval> | null = null;
  const projects = createAsync(() => getProjects());

  const [activeIndex, setActiveIndex] = createSignal(0);
  const DURATION = 2500;

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  createEffect(() => {
    if (!navStore.panelOpen) {
      if (interval) clearInterval(interval);
      interval = null;
      return;
    }

    interval = setInterval(() => {
      //   console.log("interval", activeIndex());
      const projs = projects();
      if (projs && projs.length > 0) {
        setActiveIndex((activeIndex() + 1) % projs.length);
      }
    }, DURATION);
  });

  onCleanup(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  });

  return (
    <section style={{ "--duration": `${DURATION}ms` }}>
      <h2 class="text-18 mb-24 font-bold">Latest Projects</h2>
      <ul class="relative h-320 w-full max-lg:px-10 lg:h-340">
        <For each={projects()}>
          {(project, index) => {
            const randomRotation = Math.random() * (8 - -8) + -8; // random between -10 and 10
            const hasLiveLink = Boolean(project.liveLink);
            return (
              <li
                id={`slide-${index()}`}
                style={{
                  "--index": projects().length - index(),
                  // "--rotate": `${randomRotation}deg`,
                }}
                classList={{
                  "opacity-0 pointer-events-none": activeIndex() !== index(),
                }}
                class="ease-quint-out top-0 left-1/2 z-[var(--index)] w-[82vw] -translate-x-1/2 text-center duration-400 not-first:absolute first:relative lg:w-340"
              >
                <Show
                  when={hasLiveLink}
                  fallback={
                    <div class="block">
                      <Media
                        class="aspect-[1.47/1] w-full rotate-[var(--rotate)] overflow-hidden rounded-xl object-cover"
                        {...project.thumbnail}
                      />
                    </div>
                  }
                >
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block"
                  >
                    <Media
                      class="aspect-[1.47/1] w-full rotate-[var(--rotate)] overflow-hidden rounded-xl object-cover cursor-pointer"
                      {...project.thumbnail}
                    />
                  </a>
                </Show>

                <div class="mt-32">
                  <h2 class="text-20 font-bold">{project.title}</h2>
                  <p class="text-18 line-clamp-2 opacity-50">
                    {project.byline}
                  </p>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
      <nav
        aria-label="Projects carousel"
        class="mt-24 flex justify-center gap-x-4"
      >
        <For each={projects()}>
          {(project, index) => {
            return (
              <button
                aria-current={activeIndex() === index()}
                aria-label={`View project ${project.title}`}
                aria-controls={`slide-${index()}`}
                type="button"
                class="ease-quint-out size-6 overflow-hidden rounded-full bg-[black]/30 duration-800"
                classList={{
                  "bg-[white]/20 !w-20": activeIndex() === index(),
                }}
              >
                <div
                  classList={{
                    "bg-[white] !scale-x-100 duration-[var(--duration)]":
                      activeIndex() === index(),
                  }}
                  class="size-full origin-left scale-x-0"
                ></div>
              </button>
            );
          }}
        </For>
      </nav>
    </section>
  );
}
