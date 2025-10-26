import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useKeypress } from "~/lib/hooks/useKeypress";
import Button from "./Button";

export default function CaseStudySubnav({ link }: { link: string }) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/");
	};

	useKeypress("Escape", handleClick);

	return (
		<div class="absolute pointer-events-none bottom-130 top-0 left-0 right-0 z-20 ">
			<div class="z-20 h-[calc(100svh)] sticky top-0 flex items-end justify-center pointer-events-none pb-margin-1 gap-12">
				<Show when={link}>
					<Button
						class="shrink-0 pointer-events-auto"
						link={{
							url: link,
							label: "Visit Website",
							linkType: "external",
							slug: undefined,
						}}
					/>
				</Show>
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
	);
}
