<script>
  /**
   * One message thread printed in full, rendered as the app it was sent in, with its provenance underneath.
   * @typedef {Object} Props
   * @property {import('./timeline.js').Chain} chain
   * @property {string} dateLabel
   */
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import SnapchatThread from "./SnapchatThread.svelte";
  import CitedText from "../ui/CitedText.svelte";
  import IMessageThread from "./IMessageThread.svelte";
  import { findSource, sourceHref } from "../../lib/sources.js";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { chain, dateLabel } = $props();

  const T = STRINGS.timeline;
  const original = $derived(chain.original ? findSource(chain.original.source) : undefined);
</script>

<figure class="min-w-0 flex flex-col gap-2 2xl:gap-4 w-full max-w-md 2xl:max-w-2xl">
  {#if chain.platform === "snapchat"}
    <SnapchatThread {chain} />
  {:else}
    <IMessageThread {chain} {dateLabel} />
  {/if}

  <figcaption class="px-1 text-[10px] sm:text-[11px] 2xl:text-base text-muted leading-relaxed">
    <span class="font-mono uppercase tracking-widest">{T.provenance}</span>
    <CitedText text={chain.provenance} />{#if chain.note}. <CitedText text={chain.note} />{/if}.
    {#if original && chain.original}
      <a
        href={sourceHref(original, chain.original.page)}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 ml-1 text-ink underline decoration-line underline-offset-2 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-alert"
      >
        {T.viewOriginal}{#if chain.original.page}&nbsp;({T.pageLabel}&nbsp;{chain.original.page}){/if}
        <ExternalLink class="w-3 h-3 2xl:w-4 2xl:h-4" aria-hidden="true" />
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    {/if}
  </figcaption>
</figure>
