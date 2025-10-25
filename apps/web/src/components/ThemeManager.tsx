import { createEffect } from "solid-js";
import { isServer } from "solid-js/web";
import { type Theme, themeStore } from "~/lib/stores/themeStore";

export default function ThemeManager() {
	createEffect(() => {
		if (isServer) return;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

		function setTheme(theme: Theme) {
			themeStore.theme = theme;
			document.documentElement.setAttribute("data-theme", theme);
			localStorage.setItem("theme", theme);
		}

		// Always set theme according to prefers-color-scheme, regardless of any localStorage value
		setTheme(prefersDark.matches ? "dark" : "light");

		const listener = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "dark" : "light");
		};
		prefersDark.addEventListener("change", listener);
	});

	return null;
}
