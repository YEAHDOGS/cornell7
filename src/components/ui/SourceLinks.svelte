<script>
  /**
   * Compact citation chips. Resolves source ids against data/sources.json; every link opens in a new tab.
   * @typedef {Object} Props
   * @property {string[]} [ids] - Source ids to cite.
   */
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { findSource, sourceHref } from "../../lib/sources.js";

  /** @type {Props} */
  let { ids = [] } = $props();

  const cited = $derived(ids.map(findSource).filter((s) => s !== undefined));
</script>

{#if cited.length}
  <ul class="flex flex-wrap gap-1.5 2xl:gap-2.5">
    {#each cited as source (source.id)}
      <li>
        <a
          href={sourceHref(source)}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[10px] sm:text-[11px] 2xl:text-base font-mono text-muted hover:text-ink hover:border-steel focus-visible:outline-2 focus-visible:outline-alert"
        >
          {source.short}
          <ExternalLink class="w-3 h-3 2xl:w-4 2xl:h-4" aria-hidden="true" />
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
