<script>
  /**
   * A chat participant's name. When it exactly matches a dossier (full name), it becomes an inline button that
   * opens that dossier in place; otherwise it renders as plain text. Inherits the surrounding chat styling.
   * @typedef {Object} Props
   * @property {string} name
   */
  import { dossierIdForName } from "./dossierLinks.js";
  import { openDossier } from "../../lib/dossierView.svelte.js";

  /** @type {Props} */
  let { name } = $props();

  const id = $derived(dossierIdForName(name));
</script>

{#if id}<button
    type="button"
    aria-haspopup="dialog"
    onclick={() => id && openDossier(id)}
    class="inline cursor-pointer underline decoration-dotted decoration-1 underline-offset-2 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-alert rounded-sm"
    >{name}<span class="sr-only"> (open dossier)</span></button
  >{:else}{name}{/if}
