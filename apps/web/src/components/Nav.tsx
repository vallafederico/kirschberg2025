import { A } from "@solidjs/router";

export const Nav = () => {
	return (
		<nav class="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-100 pt-19 flex items-center justify-between py-6">
			<div class="border-[#0D0D0D]/25 border px-26 py-13 backdrop-blur-[96px] bg-[#0D0D0D]/50 w-450 font-medium text-white text-18 rounded-lg text-center relative">
				<A href="/" class="pointer-events-auto">
					Kirschberg
				</A>
				<button
					type="button"
					class="absolute pointer-events-auto w-72 h-56 flex-center top-1/2 -translate-y-1/2 right-0 cursor-pointer"
				>
					<img src="/icons/menu-icon.svg" class="size-15" alt="" />
				</button>
			</div>
		</nav>
	);
};
