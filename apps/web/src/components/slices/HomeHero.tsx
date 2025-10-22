import { For, Show } from "solid-js";

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
		<>
			<header class="w-[40%] text-center mx-auto">
				<Show when={heading}>
					<h1 class="text-32">{heading}</h1>
				</Show>
				<Show when={blurb}>
					<p class="text-18 mt-12">{blurb}</p>
				</Show>
			</header>
			<div>
				<For each={caseStudies}>
					{(caseStudy) => {
						console.log(caseStudy);
						const client = caseStudy?.client
							? caseStudy.client.map((c) => c.name)?.join(" & ")
							: null;
						const role = caseStudy?.role ? caseStudy.role.join(", ") : null;

						return (
							<div>
								<h2 class="text-18">{caseStudy.title}</h2>
								<p class="">
									{client}
									<Show when={client && role}>•</Show>
									{role}
								</p>
							</div>
						);
					}}
				</For>
			</div>
		</>
	);
}
