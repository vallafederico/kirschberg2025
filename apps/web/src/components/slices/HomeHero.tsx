import { For, Show } from "solid-js";
import Media from "~/components/Media";

interface HomeHeroProps {
	caseStudies: any[];
	heading?: string;
	blurb?: string;
}

export default function HomeHero({
	caseStudies,
	heading,
	blurb,
}: HomeHeroProps) {
	return (
		<div class="flex h-screen justify-between pb-19 flex-col">
			<header class="h-full flex-center pt-50 w-[40%] text-center mx-auto">
				<div>
					<Show when={heading}>
						<h1 class="font-display text-32">{heading}</h1>
					</Show>
					<Show when={blurb}>
						<p class="text-14 lg:text-18 mt-12">{blurb}</p>
					</Show>
				</div>
			</header>
			<ul class="flex gap-x-18 items-end">
				<For each={caseStudies}>
					{(caseStudy) => {
						const client = caseStudy?.client
							? caseStudy.client.map((c) => c.name)?.join(" & ")
							: null;
						const role = caseStudy?.role ? caseStudy.role.join(", ") : null;

						return (
							<li class="w-300 h-full">
								<div class="mb-12">
									<h2 class="text-18">{caseStudy.title}</h2>
									<p class="text-12 font-semibold mt-2 text-gry">
										{client}
										<Show when={client && role}>•</Show>
										{role}
									</p>
								</div>
								<div class="rounded-md h-380 overflow-hidden">
									<Media
										class="size-full relative -translate-y-1/2 top-1/2 object-cover object-center"
										{...caseStudy?.featuredMedia?.[1]}
									/>
								</div>
							</li>
						);
					}}
				</For>
			</ul>
		</div>
	);
}
