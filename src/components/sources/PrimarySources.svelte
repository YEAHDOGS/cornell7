<script>
  /**
   * The primary record (court filings, police records, official statements) as cards, shown at the top of the
   * page under the lead. Self-hosted PDFs are highlighted; every link opens in a new tab.
   * Portrait phones swipe through the cards (SwipeRow); everything wider gets a grid.
   */
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import FileText from "@lucide/svelte/icons/file-text";
  import SwipeRow from "../ui/SwipeRow.svelte";
  import { SOURCE_LIST, sourceHref } from "../../lib/sources.js";
  import STRINGS from "../../data/strings.json";

  const T = STRINGS.sources;
  const PRIMARY = SOURCE_LIST.filter((s) => s.kind !== "citation");
  const KIND_LABELS = /** @type {Record<string, string>} */ ({ filing: T.filingLabel, official: T.officialLabel });
  const NEW_TAB = "(opens in a new tab)";
</script>

<section aria-labelledby="primary-sources-title" class="flex flex-col gap-3 2xl:gap-6">
  <div>
    <h2 id="primary-sources-title" class="text-base sm:text-lg lg:text-xl 2xl:text-4xl font-bold text-ink">{T.primaryTitle}</h2>
    <p class="text-xs sm:text-sm 2xl:text-xl text-muted">{T.primarySubtitle}</p>
  </div>

  <SwipeRow label={T.primaryTitle}>
    <ul class="flex w-max sm:w-auto sm:grid sm:grid-cols-2 landscape-phone:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-2 lg:gap-3 2xl:gap-6">
      {#each PRIMARY as source (source.id)}
        <!-- 80vw on phones: one card in view with the next peeking in -->
        <li
          class="shrink-0 w-[80vw] snap-start sm:w-auto flex flex-col gap-2 rounded-lg border bg-card p-3 2xl:p-6
            {source.doc ? 'border-alert/30' : 'border-line'}"
        >
          <span class="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] 2xl:text-base text-muted">
            {#if source.doc}<FileText class="shrink-0 w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-alert" aria-hidden="true" />{/if}
            <span class="uppercase tracking-widest {source.doc ? 'text-alert' : ''}">{KIND_LABELS[source.kind]}</span>
            <span class="ml-auto shrink-0">{source.date}</span>
          </span>
          <a
            href={sourceHref(source)}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-start gap-1.5 text-sm 2xl:text-2xl text-ink leading-snug underline decoration-steel/50 underline-offset-2 hover:decoration-current focus-visible:outline-2 focus-visible:outline-alert rounded-sm"
          >
            {source.title}
            <ExternalLink class="shrink-0 mt-0.5 w-3.5 h-3.5 2xl:w-5 2xl:h-5 opacity-60" aria-hidden="true" />
            <span class="sr-only">{NEW_TAB}</span>
          </a>
          <span class="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] 2xl:text-base text-muted">
            {source.publisher}
            {#if source.doc && source.url}
              <a href={source.url} target="_blank" rel="noopener noreferrer" class="uppercase tracking-widest hover:text-ink underline underline-offset-2">{T.publicCopy}<span class="sr-only"> {NEW_TAB}</span></a>
            {/if}
            {#if source.mirror}
              <a href={source.mirror} target="_blank" rel="noopener noreferrer" class="uppercase tracking-widest hover:text-ink underline underline-offset-2">{T.mirror}<span class="sr-only"> {NEW_TAB}</span></a>
            {/if}
          </span>
        </li>
      {/each}
    </ul>
  </SwipeRow>
</section>
