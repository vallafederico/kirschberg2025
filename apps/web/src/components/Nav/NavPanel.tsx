import { getDocumentByType } from "@local/sanity";
import { createAsync, query } from "@solidjs/router";
import cx from "classix";
import { navStore } from "~/lib/stores/navStore";
import Button from "../Button";
import NavProjectsCarousel from "./NavProjectsCarousel";
import styles from "./nav-panel.module.css";

const year = new Date().getFullYear();

export default function NavPanel() {
	return (
		<nav
			data-open={navStore.panelOpen}
			inert={!navStore.panelOpen ? true : undefined}
			aria-labelledby="menu-button"
			class={cx(styles["nav-panel"], "pointer-events-auto text-[#fff]")}
		>
			<div class="overflow-hidden">
				<div class="p-24 flex flex-col gap-y-32">
					{/* doesnt fucking work from server mismatch trash */}
					<NavProjectsCarousel />
					<div class="grid grid-cols-2 gap-10">
						<Button
							link={{
								linkType: "internal",
								slug: {
									current: "/archive",
								},
							}}
							class="bg-[#555555]/20 col-span-2 w-full"
						>
							Archive
						</Button>
						<Button
							class="bg-[#555555]/20"
							link={{
								linkType: "internal",
								slug: {
									current: "/about",
								},
							}}
						>
							About
						</Button>
						<Button
							class="bg-[#555555]/20"
							link={{
								linkType: "external",
								url: "mailto:info@kirschberg.com",
							}}
						>
							Email
						</Button>
					</div>

					<div class="justify-between opacity-60 !font-bold flex text-14">
						<span>
							Built with{" "}
							<a href="https://federic.ooo" target="_blank" rel="noopener">
								Federico
							</a>{" "}
							&{" "}
							<a href="https://nye.design" target="_blank" rel="noopener">
								Nathan
							</a>
						</span>
						<span>Copyright {year}</span>
					</div>
				</div>
			</div>
		</nav>
	);
}
