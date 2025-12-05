import { Show } from "solid-js";
import Media from "~/components/Media";

interface ArchiveCardProps {
  item: {
    featuredMedia?: any;
    link?: string;
  };
  index?: number;
}

export default function ArchiveCard(props: ArchiveCardProps) {
  return (
    <article class="flex flex-col gap-12">
      <Show when={props.item.featuredMedia}>
        <div class="aspect-[.6/1] overflow-hidden rounded-md">
          <Media
            {...props.item.featuredMedia}
            imageProps={{
              desktopWidth: 100,
              mobileWidth: 100,
            }}
            class="h-full w-full object-cover"
          />
        </div>
      </Show>
      <div class="flex flex-col gap-4">
        <Show when={props.item.link}>
          <a
            href={props.item.link}
            target="_blank"
            rel="noopener noreferrer"
            class="text-14 mt-4 text-blue-600 hover:underline"
          >
            View Project →
          </a>
        </Show>
      </div>
    </article>
  );
}
