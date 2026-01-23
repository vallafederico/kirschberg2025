import { For } from "solid-js";
import Button from "../Button";

export default function SocialRow({ items }: { items: any[] }) {
  return (
    <div class="overflow-x-hidden">
      <h2 class="text-24 mb-40 font-bold">Social</h2>
      <ul class="flex max-lg:flex-col gap-x-10 gap-y-10">
        <For each={items}>
          {(item) => (
            <li class="flex-1 max-lg:w-full min-w-0">
              <Button
                class="w-full bg-transparent whitespace-normal wrap-break-word"
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
