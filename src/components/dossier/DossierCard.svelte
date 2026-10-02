<script>
  /**
   * Square dossier tile. Purely presentational: the parent owns which dossier is open.
   * Type and padding scale with the tile's own width (container query units, see the style block), so the tile
   * stays square and legible at every grid column count, from 2-up phones to 8-up ultra-wides.
   * @typedef {Object} Props
   * @property {import('./dossier.js').Person} person
   * @property {string} fileLabel - e.g. "PLAINTIFF" or "DEFENDANT 03".
   * @property {() => void} onopen
   */

  /** @type {Props} */
  let { person, fileLabel, onopen } = $props();

  const IS_PLAINTIFF = $derived(person.role === "plaintiff");
</script>

<button
  type="button"
  onclick={onopen}
  aria-haspopup="dialog"
  aria-label="Open dossier: {person.name}"
  class="tile group relative aspect-square w-full overflow-hidden flex flex-col items-center justify-between text-center rounded-xl border bg-card
    transition-colors duration-200 hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alert
    {IS_PLAINTIFF ? 'border-alert/50 hover:border-alert' : 'border-line hover:border-steel'}"
>
  <span class="tile-label font-mono tracking-[0.18em] pl-[0.18em] whitespace-nowrap {IS_PLAINTIFF ? 'text-alert' : 'text-muted'}">
    {fileLabel}
  </span>

  <span
    aria-hidden="true"
    class="tile-mono self-center font-mono font-bold leading-none tracking-tight transition-colors
      {IS_PLAINTIFF ? 'text-alert/80' : 'text-ink/25 group-hover:text-ink/40'}"
  >
    {person.initials}
  </span>

  <span class="flex flex-col items-center w-full min-w-0">
    <span class="tile-name max-w-full font-semibold leading-tight text-ink truncate">{person.name}</span>
    <span class="tile-tagline text-muted leading-snug line-clamp-2">{person.tagline}</span>
  </span>
</button>

<style>
  /* Sizes track the tile's width via container query units. Lightning CSS would merge away same-rule
     fallbacks, so pre-Chrome 105 browsers get fixed rem sizes from the @supports block instead. */
  .tile {
    container-type: inline-size;
    padding: clamp(0.5rem, 7cqi, 1.75rem);
  }

  .tile-label {
    font-size: clamp(0.5rem, 5.5cqi, 1.25rem);
  }

  .tile-mono {
    font-size: clamp(1.5rem, 28cqi, 7rem);
  }

  .tile-name {
    font-size: clamp(0.75rem, 8.5cqi, 2rem);
  }

  .tile-tagline {
    margin-top: 0.125rem;
    font-size: clamp(0.625rem, 6cqi, 1.25rem);
  }

  @supports not (width: 1cqi) {
    .tile {
      padding: 0.75rem;
    }

    .tile-label {
      font-size: 0.625rem;
    }

    .tile-mono {
      font-size: 2.25rem;
    }

    .tile-name {
      font-size: 0.875rem;
    }

    .tile-tagline {
      font-size: 0.6875rem;
    }
  }
</style>
