import { usePageTransition } from "~/animation";
import { scroll } from "~/lib/utils/scroll";
import Grid from "./Grid";
import { Nav } from "./Nav/Navbar";

export default function Layout({ children }: { children: any }) {
	usePageTransition();

	return (
		<main use:scroll>
			<Nav />
			<Grid />
			{children}
		</main>
	);
}
