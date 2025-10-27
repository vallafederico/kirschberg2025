import AnimatedLine from "./AnimatedLine";

export default function AboutListWrapper({
	children,
	heading,
}: {
	children: any;
	heading: string;
}) {
	return (
		<section>
			<h2 class="text-24 font-bold mb-40">{heading}</h2>
			{children}
			<AnimatedLine class="mt-34" />
		</section>
	);
}
