import { getDocumentByType } from "@local/sanity";
import { createAsync, query } from "@solidjs/router";

const getProjects = query(() => {
	"use server";

	return getDocumentByType("case-study", {
		extraQuery: "{title,byline}",
	});
}, "projects");

export default function NavProjectsCarousel() {
	const projects = createAsync(() => getProjects());
	return (
		<div>
			<h2>Latest Projects</h2>
		</div>
	);
}
