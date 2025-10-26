import { useKeypress } from "~/lib/hooks/useKeypress";
import { navStore, setNavStore } from "~/lib/stores/navStore";

export default function NavMenuButton() {
	let button: HTMLButtonElement | null = null;

	const handleMenuToggle = () => {
		setNavStore("panelOpen", !navStore.panelOpen);
	};

	useKeypress("Escape", () => {
		if (!navStore.panelOpen || !button) return;

		setNavStore("panelOpen", false);
		button.focus();
	});

	return (
		<button
			onClick={handleMenuToggle}
			type="button"
			ref={button}
			aria-expanded={navStore.panelOpen}
			aria-controls="menu-button"
			class="absolute pointer-events-auto w-72 h-56 flex-center -top-5 right-0 cursor-pointer"
		>
			<img src="/icons/menu-icon.svg" class="size-15" alt="" />
			<span sr-only>Open menu</span>
		</button>
	);
}
