import gsap from "~/lib/gsap";
import { onIntersect } from "./intersect";

export default function lineScale(element: HTMLElement) {
	onIntersect(element, {
		onEnter: () => {
			gsap.to(element, {
				scaleX: 1,
				duration: 1.6,
				ease: "slow.inOut",
			});
		},
	});
}
