<script>
  /**
   * Chronological timeline with a category filter. Chips wrap instead of scrolling sideways.
   */
  import TimelineEvent from "./TimelineEvent.svelte";
  import { CATEGORY_CLASSES } from "./timeline.js";
  import TIMELINE from "../../data/timeline.json";
  import STRINGS from "../../data/strings.json";

  const T = STRINGS.timeline;
  const ALL = "all";
  const MESSAGES = "messages";
  /** @type {import('./timeline.js').TimelineEvent[]} */
  const EVENTS = /** @type {any} */ (TIMELINE).slice().sort((/** @type {any} */ a, /** @type {any} */ b) => a.date.localeCompare(b.date));
  const CATEGORY_KEYS = /** @type {(keyof typeof CATEGORY_CLASSES)[]} */ (Object.keys(T.categories));
  const MESSAGE_COUNT = EVENTS.reduce((n, e) => n + e.chains.reduce((m, c) => m + c.messages.length, 0), 0);

  let filter = $state(ALL);

  const visible = $derived(
    EVENTS.filter((e) => {
      if (filter === ALL) return true;
      if (filter === MESSAGES) return e.chains.length > 0;
      return e.category === filter;
    }),
  );

  const CHIP_CLASS =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 2xl:px-4 2xl:py-2 text-[11px] sm:text-xs 2xl:text-lg transition-colors focus-visible:outline-2 focus-visible:outline-alert";
</script>

<section id="timeline" aria-labelledby="timeline-title" class="scroll-mt-4">
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-3 2xl:mb-6">
    <h2 id="timeline-title" class="text-lg sm:text-xl lg:text-2xl 2xl:text-5xl font-bold text-ink">{T.title}</h2>
    <p class="text-xs sm:text-sm 2xl:text-xl text-muted">{EVENTS.length} {T.eventsLabel} · {MESSAGE_COUNT} {T.messagesLabel}</p>
  </div>

  <div role="group" aria-label={T.filterLabel} class="flex flex-wrap gap-1.5 2xl:gap-3 mb-6 2xl:mb-10">
    <button
      type="button"
      aria-pressed={filter === ALL}
      onclick={() => (filter = ALL)}
      class="{CHIP_CLASS} {filter === ALL ? 'border-ink text-ink bg-card-hover' : 'border-line text-muted hover:text-ink'}"
    >
      {T.all}
    </button>
    <button
      type="button"
      aria-pressed={filter === MESSAGES}
      onclick={() => (filter = MESSAGES)}
      class="{CHIP_CLASS} {filter === MESSAGES ? 'border-snap text-snap bg-card-hover' : 'border-line text-muted hover:text-ink'}"
    >
      {T.withMessages}
    </button>
    {#each CATEGORY_KEYS as key (key)}
      <button
        type="button"
        aria-pressed={filter === key}
        onclick={() => (filter = key)}
        class="{CHIP_CLASS} {filter === key ? 'border-ink text-ink bg-card-hover' : 'border-line text-muted hover:text-ink'}"
      >
        <span class="w-2 h-2 2xl:w-3 2xl:h-3 rounded-full {CATEGORY_CLASSES[key]}" aria-hidden="true"></span>
        {T.categories[key]}
      </button>
    {/each}
  </div>

  <ol>
    {#each visible as event (event.id)}
      <TimelineEvent {event} />
    {/each}
  </ol>
</section>
