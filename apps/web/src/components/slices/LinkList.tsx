import { SanityImage } from "@local/sanity";
import cx from "classix";
import { For, Show } from "solid-js";
import AboutListWrapper from "../AboutListWrapper";
import Arrow from "../Arrow";
import Media from "../Media";

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
					<li
						class="flex max-lg:flex-col gap-y-40 not-last:mb-40"
						data-size={item.imageSize}
					>
						<h3 class="w-[34%] max-lg:w-full pr-20 shrink-0 text-20">{item.label}</h3>
						<ul class="w-full min-w-0">
							<For each={item.items}>
								{(subItem) => (
									<li class="not-last:mb-24 w-full min-w-0">
										<article class="w-full min-w-0">
											<a
												target="_blank"
												class="flex gap-12 w-full relative min-w-0"
												href={subItem?.link || ""}
											>
												<div
													class={cx(
														"overflow-hidden rounded-md shrink-0",
														item.imageSize === "square"
															? "size-64 max-lg:size-48"
															: "w-170 max-lg:w-120 aspect-video",
													)}
												>
													<Media
														{...subItem.media}
														class={cx(
															"-outline-offset-1 scale-110 outline-inverted/10 ",
														)}
													/>
												</div>

												<div class="text-18 pr-20 max-lg:pr-32 lg:pr-60 w-full min-w-0">
													<h4 class="font-medium">{subItem.title}</h4>
													<p class="font-semibold">{subItem.description}</p>
												</div>
												<Show when={subItem.link}>
													<Arrow class="absolute text-inverted right-0 top-15 size-11 shrink-0" />
												</Show>
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
