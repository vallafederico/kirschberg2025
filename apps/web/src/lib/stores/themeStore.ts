import { createStore } from "solid-js/store";

export type Theme = "light" | "dark";

const [themeStore, setThemeStore] = createStore({
	theme: "dark" as Theme,
});

export { themeStore, setThemeStore };
