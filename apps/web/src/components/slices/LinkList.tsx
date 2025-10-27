import { SanityImage } from "@local/sanity";
import { For } from "solid-js";
import AboutListWrapper from "../AboutListWrapper";
import Arrow from "../Arrow";

export default function LinkList({
	items,
	heading,
}: {
	items: any[];
	heading: string;
}) {
	return (
		<AboutListWrapper heading={heading}>
			<ul>
				{items.map((item) => (
					<li class="flex not-last:mb-40">
						<h3 class="w-[34%] pr-20  shrink-0 text-20">{item.label}</h3>
						<ul class="w-full">
							<For each={item.items}>
								{(subItem) => (
									<li class="not-last:mb-24 w-full">
										<article class="w-full">
											<a
												target="_blank"
												class="flex gap-12 w-full relative"
												href={subItem?.link || ""}
											>
												<SanityImage
													class="size-64 rounded-md"
													src={subItem.image}
												/>
												<div class="text-18">
													<h4 class="font-medium">{subItem.title}</h4>
													<p class="font-semibold">{subItem.description}</p>
												</div>
												<Arrow class="absolute text-inverted right-0 top-15 size-11" />
											</a>
										</article>
									</li>
								)}
							</For>
						</ul>
					</li>
				))}
			</ul>
		</AboutListWrapper>
	);
}
