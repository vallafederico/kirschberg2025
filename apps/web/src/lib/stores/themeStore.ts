import { createStore } from "solid-js/store";

export type Theme = "light" | "dark";

const [themeStore, setThemeStore] = createStore({
	theme: "light" as Theme,
});

export { themeStore, setThemeStore };
