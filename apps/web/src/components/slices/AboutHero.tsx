import { PortableText } from "@local/sanity";
import { Show } from "solid-js";
import AnimatedLine from "../AnimatedLine";

// export const [some, setSome] = createSignal(null);

export default function AboutHero({
  title,
  body,
}: {
  title: string;
  body: any[];
}) {
  const components = {
    marks: {
      mediaLink: ({
        value,
        text,
        children,
      }: {
        value: any;
        text: string;
        children: any;
      }) => {
        return (
          <a
            data-text={text}
            data-media-hover
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <header class="pt-128 lg:pt-250">
      <h2 class="text-32 lg:text-42 font-display font-[800] lg:w-[80%]">
        {title}
      </h2>
      <div class="portable mt-64 mb-34 opacity-85 [&_p]:not-last:!mb-24">
        <Show when={body}>
          {/* <pre>{JSON.stringify(body, null, 2)}</pre> */}
          <PortableText components={components} value={body} />
        </Show>
      </div>
      <AnimatedLine />
    </header>
  );
}
