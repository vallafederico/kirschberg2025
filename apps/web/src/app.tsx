import "./app.css";
import { Link, MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";
import Layout from "./components/Layout";
import ThemeManager from "./components/ThemeManager";
import Home from "./routes/(home)";
import CaseStudy from "./routes/case-study";

export default function App() {
	useViewport();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<ThemeManager />
					<Link rel="robots" type="text/plain" href="/api/robots.txt" />

					<Suspense>
						<Layout>{props.children}</Layout>
					</Suspense>
				</MetaProvider>
			)}
		>
			<Route path="/" component={Home}>
				<Route path="/" component={Home} />
				<Route path="/case/:slug" component={CaseStudy} />
			</Route>

			<Suspense>
				<FileRoutes />
			</Suspense>

			{/* <Route path="/about" component={AboutPage} /> */}
		</Router>
	);
}
