import { PortableText } from "@local/sanity";
import type { JSXElement } from "solid-js";
import { For, Show } from "solid-js";

export default function CaseStudyIntro({
  role,
  team,
  client,
  description,
}: {
  role: string[];
  team: { name: string; url: string }[];
  client: { name: string; url: string }[];
  description: any[];
}) {
  const IntroSubsection = ({
    children,
    label,
  }: {
    children: JSXElement;
    label: string;
  }) => {
    return (
      <div class="w-cols-1">
        <dt class="text-inverted/50 mb-5">{label}</dt>
        <dd>{children}</dd>
      </div>
    );
  };

  return (
    <section class="max-lg:px-16 mb-64 flex items-start max-lg:flex-col">
      <dl class="text-14 lg:w-grid-2 flex w-full shrink-0 gap-32 font-medium max-lg:mb-32 max-lg:justify-between lg:flex-col lg:pr-90">
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
      <Show when={description}>
        <div class="text-18 font-medium whitespace-pre-line [&_p]:not-last:mb-24">
          <PortableText value={description} />
        </div>
      </Show>
    </section>
  );
}
