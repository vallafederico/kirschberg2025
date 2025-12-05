import { useNavigate } from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import { useKeypress } from "~/lib/hooks/useKeypress";
import gsap, { A } from "~/lib/gsap";
import Button from "./Button";

export default function CaseStudySubnav({ link }: { link: string }) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/");
	};

	useKeypress("Escape", handleClick);

	let visitWebsiteRef: HTMLElement | undefined;
	let closeButtonRef: HTMLElement | undefined;

	createEffect(() => {
		// Track link to ensure effect runs when it changes
		const currentLink = link;
		
		// Calculate when main animation completes: delay (0.1s) + duration (1.2s) = 1.3s
		const mainAnimationDuration = 0.1 + A.page.in.duration;
		const buttons = [visitWebsiteRef, closeButtonRef].filter(Boolean) as HTMLElement[];

		if (buttons.length === 0) return;

		// Clean up any existing animations
		gsap.killTweensOf(buttons);

		// Set initial state: invisible
		gsap.set(buttons, {
			opacity: 0,
		});

		// Fade in after main animation completes
		gsap.to(buttons, {
			opacity: 1,
			duration: 0.6,
			ease: "power2.out",
			delay: mainAnimationDuration,
		});
	});

	return (
		<div class="absolute pointer-events-none bottom-130 top-0 left-0 right-0 z-20 ">
			<div class="z-20 h-[calc(100svh)] sticky top-0 flex items-end justify-center pointer-events-none pb-margin-1 gap-12">
				<Show when={link}>
					<div ref={(el) => (visitWebsiteRef = el)}>
						<Button
							class="shrink-0 pointer-events-auto"
							link={{
								url: link,
								label: "Visit Website",
								linkType: "external",
								slug: undefined,
							}}
						/>
					</div>
				</Show>
				<div ref={(el) => (closeButtonRef = el)}>
					<Button
						class="shrink-0 pointer-events-auto"
						aria-label="Close Case Study"
						aria-controls="case-study"
						variant="circle"
						onClick={handleClick}
					>
						x
					</Button>
				</div>
			</div>
		</div>
	);
}
