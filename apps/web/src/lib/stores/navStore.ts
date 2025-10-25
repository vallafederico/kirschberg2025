import { createStore } from "solid-js/store";

const [navStore, setNavStore] = createStore({
	panelOpen: false,
});

export { navStore, setNavStore };
