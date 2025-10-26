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
		<div class="fixed left-1/2 z-20 -translate-x-1/2 flex gap-12 items-center top-[calc(100lvh-6.5rem)]">
			<Show when={link}>
				<Button
					class="shrink-0"
					link={{
						url: link,
						label: "Visit Website",
						linkType: "external",
						slug: undefined,
					}}
				/>
			</Show>
			<Button
				class="shrink-0"
				aria-label="Close Case Study"
				aria-controls="case-study"
				variant="circle"
				onClick={handleClick}
			>
				x
			</Button>
		</div>
	);
}
