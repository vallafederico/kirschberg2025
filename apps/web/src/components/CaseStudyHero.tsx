import Media from "./Media";

interface CaseStudyHeroProps {
	title: string;
	featuredMedia: any;
	byline: string;
}

export default function CaseStudyHero({
	title,
	featuredMedia,
	byline,
}: CaseStudyHeroProps) {
	return (
		<header class="relative mb-64">
			<div class="w-full max-h-550 lg:rounded-xxl overflow-hidden">
				<Media
					imageProps={{
						desktopWidth: 52,
						mobileWidth: 95,
					}}
					class="w-full relative  object-cover"
					{...(featuredMedia?.[0] || {})}
				/>
			</div>
			<div class="lg:w-[47%] max-lg:px-margin-1 lg:ml-grid-2">
				<h1 id="case-title" class="text-32 font-display font-medium mt-44">
					{title}
				</h1>
				<p class="text-32 opacity-80 font-display font-medium">{byline}</p>
			</div>
		</header>
	);
}
