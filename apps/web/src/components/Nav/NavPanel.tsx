import cx from "classix";
import { navStore } from "~/lib/stores/navStore";
import styles from "./nav-panel.module.css";
export default function NavPanel() {
	return (
		<div
			data-open={navStore.panelOpen}
			class={cx(styles["nav-panel"], "pointer-events-auto")}
		>
			<div class="overflow-hidden">
				<p>
					Esse eiusmod consequat quis ea incididunt duis incididunt sunt. Qui
					sit cillum tempor adipisicing irure ullamco labore cupidatat qui in
					velit magna. Fugiat sint pariatur mollit veniam elit irure culpa. Anim
					consectetur amet tempor reprehenderit minim irure do magna nulla et
					laboris. Lorem nisi quis occaecat exercitation deserunt culpa id et in
					sint. Consectetur et in ullamco id esse ullamco ad. Officia ut
					excepteur labore pariatur ullamco amet. Duis adipisicing quis Lorem.
				</p>
			</div>
		</div>
	);
}
