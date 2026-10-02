<script>
  /**
   * Citations: the press reporting cited across the page, at the bottom. The primary record (court filings and
   * official statements) lives at the top of the page in PrimarySources.svelte. Every link opens in a new tab.
   */
  import { SOURCE_LIST, sourceHref } from "../../lib/sources.js";
  import STRINGS from "../../data/strings.json";

  const T = STRINGS.sources;
  const CITATIONS = SOURCE_LIST.filter((s) => s.kind === "citation");
  const NEW_TAB = "(opens in a new tab)";
</script>

<section id="sources" aria-labelledby="sources-title" class="scroll-mt-4">
  <h2 id="sources-title" class="text-lg sm:text-xl lg:text-2xl 2xl:text-5xl font-bold text-ink mb-1">{T.citationsTitle}</h2>
  <p class="text-xs sm:text-sm 2xl:text-xl text-muted mb-4 2xl:mb-8">{T.citationsSubtitle}</p>

  <ol class="grid grid-cols-1 sm:grid-cols-2 landscape-phone:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-2 2xl:gap-x-10 2xl:gap-y-4">
    {#each CITATIONS as source (source.id)}
      <li class="min-w-0">
        <a
          href={sourceHref(source)}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col gap-0.5 py-1 text-sm 2xl:text-2xl text-ink/90 hover:text-ink focus-visible:outline-2 focus-visible:outline-alert rounded-sm"
        >
          <span class="font-mono text-[10px] sm:text-[11px] 2xl:text-base text-muted">
            {source.publisher}{#if source.date}&nbsp;·&nbsp;{source.date}{/if}
          </span>
          <span class="underline decoration-steel/50 underline-offset-2 group-hover:decoration-current">{source.title}</span>
          <span class="sr-only">{NEW_TAB}</span>
        </a>
      </li>
    {/each}
  </ol>
</section>
