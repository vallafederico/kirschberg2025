import { For } from "solid-js";
import Button from "../Button";

export default function SocialRow({ items }: { items: any[] }) {
	return (
		<div>
			<h2 class="text-24 font-bold mb-40">Social</h2>
			<ul class="flex gap-x-10">
				<For each={items}>
					{(item) => (
						<li class="w-full">
							<Button
								class="w-full"
								link={{
									linkType: "external",
									url: item.url,
									label: item.name,
								}}
							/>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
