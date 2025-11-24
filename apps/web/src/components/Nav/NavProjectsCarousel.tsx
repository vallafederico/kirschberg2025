import { getDocumentByType } from "@local/sanity";
import { createAsync, query } from "@solidjs/router";
import gsap from "gsap";
import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { navStore } from "~/lib/stores/navStore";
import Media from "../Media";

const getProjects = query(() => {
  "use server";

  return getDocumentByType("case-study", {
    extraQuery: "{title,byline,slug,'thumbnail':featuredMedia[0]}",
  });
}, "projects");

export default function NavProjectsCarousel() {
  let interval = null;
  const projects = createAsync(() => getProjects());

  const [activeIndex, setActiveIndex] = createSignal(0);
  const DURATION = 2500;

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  createEffect(() => {
    if (!navStore.panelOpen) {
      if (interval) clearInterval(interval);
      return;
    }

    interval = setInterval(() => {
      //   console.log("interval", activeIndex());
      setActiveIndex((activeIndex() + 1) % projects().length);
    }, DURATION);
  });

  return (
    <section style={{ "--duration": `${DURATION}ms` }}>
      <h2 class="text-18 mb-24 font-bold">Latest Projects</h2>
      <ul class="relative h-320 w-full max-lg:px-10 lg:h-340">
        <For each={projects()}>
          {(project, index) => {
            const randomRotation = Math.random() * (8 - -8) + -8; // random between -10 and 10
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
                {/* <A href={project.slug.fullUrl}> */}
                <Media
                  class="aspect-[1.47/1] w-full rotate-[var(--rotate)] overflow-hidden rounded-xl object-cover"
                  {...project.thumbnail}
                />

                <div class="mt-32">
                  <h2 class="text-20 font-bold">{project.title}</h2>
                  <p class="text-18 line-clamp-2 opacity-50">
                    {project.byline}
                  </p>
                </div>
                {/* </A> */}
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
