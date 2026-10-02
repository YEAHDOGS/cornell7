<script>
  /**
   * Renders data prose. [label](source-id[@page]) markup becomes a citation link (new tab); pre-linked
   * `segments` may also carry dossier mentions, rendered as inline buttons that open that dossier in place.
   * Inline only: the parent supplies the block element and typography.
   * @typedef {Object} Props
   * @property {string} [text] - Raw prose with citation markup.
   * @property {import('../../lib/sources.js').TextSegment[]} [segments] - Already-parsed segments.
   */
  import { parseCitations } from "../../lib/sources.js";
  import { openDossier } from "../../lib/dossierView.svelte.js";

  /** @type {Props} */
  let { text = "", segments } = $props();

  /** @type {import('../../lib/sources.js').TextSegment[]} */
  const parts = $derived(segments || parseCitations(text));
  const LINK_CLASS = "underline decoration-1 underline-offset-2 hover:decoration-current hover:text-ink focus-visible:outline-2 focus-visible:outline-alert rounded-sm";
</script>

{#each parts as part, i (i)}{#if "href" in part}<a
      href={part.href}
      target="_blank"
      rel="noopener noreferrer"
      class="{LINK_CLASS} decoration-steel/60"
      >{part.text}<span class="sr-only"> (opens in a new tab)</span></a
    >{:else if "dossier" in part}<button
      type="button"
      aria-haspopup="dialog"
      onclick={() => openDossier(part.dossier)}
      class="{LINK_CLASS} decoration-dotted decoration-alert/70 cursor-pointer inline"
      >{part.text}<span class="sr-only"> (open dossier)</span></button
    >{:else}{part.text}{/if}{/each}
