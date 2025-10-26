import { getDocumentByType } from "@local/sanity";
import { A, createAsync, query } from "@solidjs/router";
import { For } from "solid-js";

const getProjects = query(() => {
	"use server";

	return getDocumentByType("case-study", {
		extraQuery: "{title,byline,slug}",
	});
}, "projects");

export default function NavProjectsCarousel() {
	const projects = createAsync(() => getProjects());
	return (
		<div>
			<h2>Latest Projects</h2>

			<ul>
				<For each={projects()}>
					{(project) => (
						<li>
							<A href={project.slug.fullUrl}>{project.title}</A>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
