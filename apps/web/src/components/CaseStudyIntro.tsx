import type { JSXElement } from "solid-js";
import { For, Match, Show } from "solid-js";

export default function CaseStudyIntro({
	role,
	team,
	client,
}: {
	role: string[];
	team: { name: string; url: string }[];
	client: { name: string; url: string }[];
}) {
	const IntroSubsection = ({
		children,
		label,
	}: {
		children: JSXElement;
		label: string;
	}) => {
		return (
			<div>
				<dt class="text-inverted/50 mb-5">{label}</dt>
				<dd>{children}</dd>
			</div>
		);
	};

	return (
		<section>
			<dl class="text-14 w-[80%] flex gap-80 font-medium">
				<Show when={role}>
					<IntroSubsection label="Role">{role.join(", ")}</IntroSubsection>
				</Show>
				<Show when={team}>
					<IntroSubsection label="Team">
						<ul>
							<For each={team}>
								{(t) => (
									<li>
										<Show when={t.url}>
											<a
												class="underline"
												rel="noopener noreferrer"
												target="_blank"
												href={t.url}
											>
												{t.name}
											</a>
										</Show>
										<Show when={!t.url}> {t.name} </Show>
									</li>
								)}
							</For>
						</ul>
					</IntroSubsection>
				</Show>
				<Show when={client}>
					<IntroSubsection label="Client">
						<ul>
							<For each={client}>
								{(c) => {
									return (
										<li>
											<Show when={c.url}>
												<a
													rel="noopener noreferrer"
													class="underline"
													href={c.url}
												>
													{c.name}
												</a>
											</Show>
											<Show when={!c.url}> {c.name} </Show>
										</li>
									);
								}}
							</For>
						</ul>
					</IntroSubsection>
				</Show>
			</dl>
		</section>
	);
}
