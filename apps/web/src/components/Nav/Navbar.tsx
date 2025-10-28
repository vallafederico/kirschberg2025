import { A, useLocation } from "@solidjs/router";
import cx from "classix";
import { createEffect } from "solid-js";
import { navStore } from "~/lib/stores/navStore";
import { Resizer } from "~/lib/utils/resizer";
import { setCssVariable } from "~/utils/css";
import NavMenuButton from "./NavMenuButton";
import NavPanel from "./NavPanel";

export const Nav = () => {
	let el: HTMLDivElement | null = null;

	const getNavHeight = () => {
		if (el) {
			const height = el.clientHeight;
			setCssVariable("--nav-height", `${height}px`);
		}
	};

	const location = useLocation();

	createEffect(() => {
		console.log("location", location);
	});

	Resizer.add(getNavHeight);

	return (
		<div class="pointer-events-none fixed max-lg:left-margin-1 max-lg:right-margin-1 max-lg:bottom-10 lg:top-0 left-1/2 lg:-translate-x-1/2 z-100 pt-19 flex items-center justify-between py-6">
			<div
				class={cx(
					"border-[#0D0D0D]/25 dark:border-white/25 dark:bg-white/20 flex flex-col max-lg:flex-col-reverse border backdrop-blur-[96px] bg-[#0D0D0D]/50 w-full lg:w-450 font-medium duration-500 ease-quad-out text-inverted text-18 rounded-lg text-center relative",
					navStore.panelOpen && "!bg-[#0D0D0D]/80",
				)}
			>
				<div ref={el} class="w-full px-26 py-13">
					<A href="/" class="text-[#fff] pointer-events-auto">
						Kirschberg
					</A>
					<NavMenuButton />
				</div>
				<NavPanel />
			</div>
		</div>
	);
};
