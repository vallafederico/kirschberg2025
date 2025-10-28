import { getDocumentByType } from "@local/sanity";
import { createAsync, query } from "@solidjs/router";
import gsap from "gsap";
import { createEffect, createSignal, For, onCleanup } from "solid-js";
import Media from "../Media";

const getProjects = query(() => {
	"use server";

	return getDocumentByType("case-study", {
		extraQuery: "{title,byline,slug,'thumbnail':featuredMedia[0]}",
	});
}, "projects");

export default function NavProjectsCarousel() {
	let interval = null;
	const projects = createAsync(() => getProjects());

	const [activeIndex, setActiveIndex] = createSignal(0);
	const DURATION = 2500;

	const handleClick = (index: number) => {
		setActiveIndex(index);
	};

	createEffect(() => {
		setInterval(() => {
			console.log("interval", activeIndex());
			setActiveIndex((activeIndex() + 1) % projects().length);
		}, DURATION);
	});

	return (
		<section style={{ "--duration": `${DURATION}ms` }}>
			<h2 class="text-20 font-bold mb-24">Latest Projects</h2>
			<ul class="relative max-lg:px-10 h-340 w-full">
				<For each={projects()}>
					{(project, index) => {
						const randomRotation = Math.random() * (8 - -8) + -8; // random between -10 and 10
						return (
							<li
								id={`slide-${index()}`}
								style={{
									"--index": projects().length - index(),
									// "--rotate": `${randomRotation}deg`,
								}}
								classList={{
									"opacity-0 pointer-events-none": activeIndex() !== index(),
								}}
								class="z-[var(--index)] duration-400 ease-quint-out first:relative not-first:absolute w-[85vw] lg:w-340 top-0 left-1/2 -translate-x-1/2 text-center"
							>
								{/* <A href={project.slug.fullUrl}> */}
								<Media
									class="aspect-[1.47/1] rotate-[var(--rotate)] w-full rounded-xl overflow-hidden object-cover"
									{...project.thumbnail}
								/>

								<div class="mt-32">
									<h2 class="text-20">{project.title}</h2>
									<p class="text-18">{project.byline}</p>
								</div>
								{/* </A> */}
							</li>
						);
					}}
				</For>
			</ul>
			<nav
				aria-label="Projects carousel"
				class="flex gap-x-4 mt-24 justify-center"
			>
				<For each={projects()}>
					{(project, index) => {
						return (
							<button
								aria-current={activeIndex() === index()}
								aria-label={`View project ${project.title}`}
								aria-controls={`slide-${index()}`}
								type="button"
								class="size-6 rounded-full overflow-hidden bg-[black]/30 duration-800 ease-quint-out"
								classList={{
									"bg-[white]/20 !w-20": activeIndex() === index(),
								}}
							>
								<div
									classList={{
										"bg-[white] !scale-x-100 duration-[var(--duration)]":
											activeIndex() === index(),
									}}
									class="size-full scale-x-0 origin-left"
								></div>
							</button>
						);
					}}
				</For>
			</nav>
		</section>
	);
}
