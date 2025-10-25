import "./app.css";
import { Link, MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Grid from "~/components/Grid";
import { Nav } from "~/components/Nav/Navbar";
import { useViewport } from "~/lib/hooks/useViewport";
import { scroll } from "~/lib/utils/scroll";

import { usePageTransition } from "./animation";
import ThemeManager from "./components/ThemeManager";

export default function App() {
	useViewport();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<ThemeManager />
					<Link rel="robots" type="text/plain" href="/api/robots.txt" />

					<Nav />
					<Grid />

					<Suspense>
						<GlobalLayout>{props.children}</GlobalLayout>
					</Suspense>
				</MetaProvider>
			)}
		>
			<Suspense fallback={<div></div>}>
				<FileRoutes />
			</Suspense>
		</Router>
	);
}

// ////////////////

const GlobalLayout = ({ children, ...props }: { children: any }) => {
	usePageTransition();

	return <main use:scroll>{children}</main>;
};
