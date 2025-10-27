import { For, Show } from "solid-js";
import AboutListWrapper from "../AboutListWrapper";

export default function AboutTextList({
	items,
	heading,
}: {
	items: any[];
	heading: string;
}) {
	return (
		<AboutListWrapper heading={heading}>
			<ul>
				<For each={items}>
					{(item) => (
						<li class="flex not-last:mb-48">
							<h3 class="w-[34%] pr-20 shrink-0 text-20">{item.title}</h3>
							<ul class="w-full text-18 font-medium">
								<For each={item.subItems}>
									{(subItem) => (
										<li class="not-last:mb-2 flex justify-between gap-8">
											<Show when={subItem.title}>
												<span>{subItem.title}</span>
											</Show>
											<Show when={subItem.subtext}>
												<span>{subItem.subtext}</span>
											</Show>
										</li>
									)}
								</For>
							</ul>
						</li>
					)}
				</For>
			</ul>
		</AboutListWrapper>
	);
}
