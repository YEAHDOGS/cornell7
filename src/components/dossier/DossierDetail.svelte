<script>
  /**
   * Full dossier body, rendered inside SlidePanel.
   * @typedef {Object} Props
   * @property {import('./dossier.js').Person} person
   * @property {string} fileLabel
   */
  import SourceLinks from "../ui/SourceLinks.svelte";
  import CitedText from "../ui/CitedText.svelte";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { person, fileLabel } = $props();

  const T = STRINGS.dossier;
  const IS_PLAINTIFF = $derived(person.role === "plaintiff");
  const HEADING_CLASS = "font-mono text-[10px] sm:text-xs 2xl:text-lg tracking-[0.18em] text-muted mb-2 2xl:mb-4";
  const LIST_CLASS = "flex flex-col gap-2 2xl:gap-4 text-sm sm:text-[15px] 2xl:text-2xl leading-relaxed text-ink/90";
</script>

<article class="flex flex-col gap-6 2xl:gap-10">
  <header class="flex items-center gap-4 2xl:gap-8">
    <div
      aria-hidden="true"
      class="shrink-0 grid place-items-center w-16 h-16 sm:w-20 sm:h-20 2xl:w-36 2xl:h-36 rounded-xl border font-mono font-bold text-2xl sm:text-3xl 2xl:text-6xl
        {IS_PLAINTIFF ? 'border-alert/60 text-alert' : 'border-line text-ink/40'}"
    >
      {person.initials}
    </div>
    <div class="min-w-0">
      <p class="font-mono text-[10px] sm:text-xs 2xl:text-lg tracking-[0.18em] {IS_PLAINTIFF ? 'text-alert' : 'text-muted'}">
        {fileLabel}
      </p>
      <h2 class="text-xl sm:text-2xl 2xl:text-5xl font-bold text-ink leading-tight">{person.name}</h2>
      <p class="text-xs sm:text-sm 2xl:text-2xl text-muted mt-1">{person.tagline}</p>
    </div>
  </header>

  {#if person.facts.length}
    <dl class="grid grid-cols-1 sm:grid-cols-2 landscape-phone:grid-cols-2 gap-2 2xl:gap-4">
      {#each person.facts as fact (fact.label)}
        <div class="rounded-lg border border-line bg-app/50 px-3 py-2 2xl:px-5 2xl:py-4">
          <dt class="font-mono text-[9px] sm:text-[10px] 2xl:text-base tracking-[0.15em] text-muted uppercase">{fact.label}</dt>
          <dd class="text-sm 2xl:text-2xl text-ink mt-0.5"><CitedText text={fact.value} /></dd>
        </div>
      {/each}
    </dl>
  {/if}

  {#if person.alleged.length}
    <section>
      <h3 class={HEADING_CLASS}>{IS_PLAINTIFF ? T.plaintiffAccount : T.alleged}</h3>
      <ul class={LIST_CLASS}>
        {#each person.alleged as line, i (i)}
          <li class="pl-3 2xl:pl-5 border-l-2 {IS_PLAINTIFF ? 'border-alert/50' : 'border-line'}"><CitedText text={line} /></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if person.response.length}
    <section>
      <h3 class={HEADING_CLASS}>{IS_PLAINTIFF ? T.plaintiffAftermath : T.response}</h3>
      <ul class={LIST_CLASS}>
        {#each person.response as line, i (i)}
          <li class="pl-3 2xl:pl-5 border-l-2 border-steel/50"><CitedText text={line} /></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if !IS_PLAINTIFF}
    <p class="text-[11px] sm:text-xs 2xl:text-lg text-muted italic leading-relaxed">{person.role === "institution" ? T.institutionPresumption : T.presumption}</p>
  {/if}

  <section>
    <h3 class={HEADING_CLASS}>{T.sources}</h3>
    <SourceLinks ids={person.sources} />
  </section>
</article>
