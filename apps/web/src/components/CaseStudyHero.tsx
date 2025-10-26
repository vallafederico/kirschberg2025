import Media from "./Media";

interface CaseStudyHeroProps {
	title: string;
	featuredMedia: any;
}

export default function CaseStudyHero({
	title,
	featuredMedia,
}: CaseStudyHeroProps) {
	return (
		<header class="relative mb-64">
			<div class="w-full max-h-550 rounded-xxl overflow-hidden">
				<Media
					class="w-full relative  object-cover"
					{...(featuredMedia?.[0] || {})}
				/>
			</div>
			<h1 id="case-title" class="text-32 font-display font-medium mt-44">
				{title}
			</h1>
		</header>
	);
}
