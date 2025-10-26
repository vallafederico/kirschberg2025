import { getDocumentByType } from "@local/sanity";
import { query } from "@solidjs/router";
import cx from "classix";
import { useKeypress } from "~/lib/hooks/useKeypress";
import { navStore, setNavStore } from "~/lib/stores/navStore";
import NavProjectsCarousel from "./NavProjectsCarousel";
import styles from "./nav-panel.module.css";

const year = new Date().getFullYear();

export default function NavPanel() {
	useKeypress("Escape", () => {
		setNavStore("panelOpen", false);
		document.querySelector("button[aria-controls='menu-button']")?.focus(); // move focus back to menu button
	});

	return (
		<nav
			data-open={navStore.panelOpen}
			inert={!navStore.panelOpen ? true : undefined}
			aria-labelledby="menu-button"
			class={cx(styles["nav-panel"], "pointer-events-auto")}
		>
			<div class="overflow-hidden">
				<div class="p-24 flex flex-col gap-y-32">
					<NavProjectsCarousel />

					<div class="justify-between !font-bold text-inverted/40 flex text-14">
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
