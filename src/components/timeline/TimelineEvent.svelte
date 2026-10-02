<script>
  /**
   * One timeline entry: date rail, summary, and every message chain attached to it, printed in full.
   * @typedef {Object} Props
   * @property {import('./timeline.js').TimelineEvent} event
   */
  import MessageChain from "./MessageChain.svelte";
  import SourceLinks from "../ui/SourceLinks.svelte";
  import CitedText from "../ui/CitedText.svelte";
  import { CATEGORY_CLASSES } from "./timeline.js";
  import { linkFirstMentions } from "./dossierLinks.js";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { event } = $props();

  const CATEGORY_LABELS = /** @type {Record<string, string>} */ (STRINGS.timeline.categories);
  /* First mention of each person, organization or place in this entry opens its dossier in place */
  const linkedSummary = $derived(linkFirstMentions(event.summary));
</script>

<li
  id="event-{event.id}"
  class="relative grid grid-cols-[1rem_1fr] md:grid-cols-[8rem_1.5rem_1fr] xl:grid-cols-[10rem_2rem_1fr] 2xl:grid-cols-[16rem_3rem_1fr] gap-x-3 md:gap-x-0 scroll-mt-4"
>
  <!-- Date column (md+). On phones the date sits above the title instead. -->
  <div class="hidden md:block pr-4 pt-0.5 text-right">
    <p class="font-mono text-xs xl:text-sm 2xl:text-xl text-ink">{event.dateLabel}</p>
    {#if event.time}<p class="font-mono text-[11px] xl:text-xs 2xl:text-lg text-muted">{event.time}</p>{/if}
  </div>

  <!-- Rail -->
  <div class="relative flex justify-center" aria-hidden="true">
    <span class="absolute top-0 bottom-0 w-px bg-line"></span>
    <span class="relative mt-1.5 w-2.5 h-2.5 2xl:w-4 2xl:h-4 rounded-full ring-4 ring-app {CATEGORY_CLASSES[event.category]}"></span>
  </div>

  <div class="min-w-0 pb-8 md:pl-4 2xl:pl-8 2xl:pb-14 flex flex-col gap-3 2xl:gap-5">
    <header>
      <p class="md:hidden font-mono text-[11px] text-muted">
        {event.dateLabel}{#if event.time}&nbsp;·&nbsp;{event.time}{/if}
      </p>
      <p class="font-mono text-[9px] sm:text-[10px] 2xl:text-base tracking-[0.18em] uppercase text-muted">
        {CATEGORY_LABELS[event.category]}
      </p>
      <h3 class="text-base sm:text-lg 2xl:text-4xl font-semibold text-ink leading-snug">{event.title}</h3>
    </header>

    {#each linkedSummary as segments, i (i)}
      <p class="text-sm sm:text-[15px] 2xl:text-2xl leading-relaxed text-ink/85 max-w-3xl 2xl:max-w-5xl"><CitedText {segments} /></p>
    {/each}

    {#if event.chains.length}
      <div
        class="grid gap-4 2xl:gap-8 items-start justify-items-start
          {event.chains.length > 1 ? 'landscape-phone:grid-cols-2 lg:grid-cols-2 max-w-5xl 2xl:max-w-[90rem]' : ''}"
      >
        {#each event.chains as chain, i (i)}
          <MessageChain {chain} dateLabel={event.dateLabel} />
        {/each}
      </div>
    {/if}

    <SourceLinks ids={event.sources} />
  </div>
</li>
