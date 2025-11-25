import cx from "classix";
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
	const isImage = featuredMedia[0]?.image;

	return (
		<header class="relative mb-64">
			<div class="w-full max-h-550 lg:rounded-xxl overflow-hidden">
				<Media
					imageProps={{
						desktopWidth: 52,
						mobileWidth: 95,
					}}
					class={cx(
						"w-full relative h-full object-cover",
						isImage && "h-full -translate-y-1/4 ",
					)}
					{...(featuredMedia?.[0] || {})}
				/>
			</div>
			<div class="lg:w-[50%] max-lg:px-margin-1 lg:ml-grid-2">
				<h1 id="case-title" class="text-32 font-display font-medium mt-44">
					{title}
				</h1>
				<p class="text-32 opacity-80 font-display font-medium">{byline}</p>
			</div>
		</header>
	);
}
