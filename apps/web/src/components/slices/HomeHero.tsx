import { A } from "@solidjs/router";
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
	const ArticleCard = ({
		slug,
		title,
		client,
		role,
		featuredMedia,
	}: {
		slug: string;
		title: string;
		client: string;
		role: string;
		featuredMedia: any;
	}) => {
		const formatedClient = client
			? client.map((c) => c.name)?.join(" & ")
			: null;
		const formatedRole = role ? role?.join(", ") : null;

		return (
			<li class="shrink-0">
				<article>
					<A href={slug?.fullUrl} class="block h-full w-300">
						<div class="mb-12">
							<h2 class="text-18">{title}</h2>
							<p class="text-12 font-semibold mt-2 text-gry">
								{formatedClient}
								<Show when={formatedClient && formatedRole}>•</Show>
								{formatedRole}
							</p>
						</div>
						<div class="rounded-md h-340 lg:h-380 overflow-hidden">
							<Media
								imageProps={{
									desktopWidth: 35,
									mobileWidth: 45,
								}}
								class="size-full relative -translate-y-1/2 top-1/2 object-cover object-center"
								{...featuredMedia?.[1]}
							/>
						</div>
					</A>
				</article>
			</li>
		);
	};

	return (
		<div class="flex h-screen overflow-hidden fixed justify-between max-lg:pt-50 pb-19 flex-col w-full">
			<header class="h-full flex justify-center lg:items-center items-start lg:pt-50 px-margin-1 lg:w-[42%] text-center mx-auto">
				<div class="">
					<Show when={heading}>
						<h1 class="font-display text-[2.6rem] leading-[1.2] lg:text-32">
							{heading}
						</h1>
					</Show>
					<Show when={blurb}>
						<p class="text-14 lg:text-18 mt-12">{blurb}</p>
					</Show>
				</div>
			</header>
			<ul class="flex gap-x-18 items-end">
				<For each={caseStudies}>
					{(caseStudy) => {
						return <ArticleCard {...caseStudy} />;
					}}
				</For>
			</ul>
		</div>
	);
}
