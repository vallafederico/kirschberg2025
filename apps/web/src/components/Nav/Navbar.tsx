import cx from "classix";
import { A, useLocation } from "@solidjs/router";

import { navStore } from "~/lib/stores/navStore";
import { Resizer } from "~/lib/utils/resizer";
import { setCssVariable } from "~/utils/css";
import NavMenuButton from "./NavMenuButton";
import NavPanel from "./NavPanel";

const getNavHeight = (el: HTMLDivElement | null) => {
  if (el) {
    const height = el.clientHeight;
    setCssVariable("--nav-height", `${height}px`);
  }
};

export const Nav = () => {
  let el: HTMLDivElement | null = null;

  // const location = useLocation();
  // createEffect(() => {
  //   console.log("location", location);
  // });

  Resizer.add((data) => getNavHeight(el));

  return (
    <div class="max-lg:left-margin-1 max-lg:right-margin-1 pointer-events-none fixed left-1/2 z-100 flex items-center justify-between py-6 pt-19 max-lg:bottom-10 lg:top-0 lg:-translate-x-1/2">
      <div
        class={cx(
          "ease-quad-out text-inverted text-18 relative flex w-full flex-col rounded-lg border border-[#0D0D0D]/25 bg-[#0D0D0D]/50 text-center font-medium backdrop-blur-[96px] duration-500 max-lg:flex-col-reverse lg:w-450 dark:border-white/25 dark:bg-white/20",
          navStore.panelOpen && "bg-[#0D0D0D]/80!",
        )}
      >
        <div ref={el} class="w-full px-26 py-13">
          <A href="/" class="pointer-events-auto text-[#fff]">
            Kirschberg
          </A>
          <NavMenuButton />
        </div>
        <NavPanel />
      </div>
    </div>
  );
};
