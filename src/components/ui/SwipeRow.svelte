<script>
  /**
   * Horizontally swipeable row for portrait phones; from sm: up it's a plain wrapper and the list inside lays itself
   * out as its own grid. No scrollbar: edge arrows show which way there is more, and tap to page across.
   * The list passed in should be `flex w-max sm:w-auto sm:grid ...` with `shrink-0 snap-start sm:w-auto` items sized
   * in vw. The list must be content-wide (w-max) so the row's right padding is kept after the last card.
   * The row bleeds to the screen edges (-mx-4 cancels App.svelte's px-4 page padding) so cards swipe edge to edge.
   * The scroller is `relative` so absolutely positioned children (sr-only labels) in off-screen cards are clipped by
   * it, rather than stretching <main> sideways.
   * @typedef {Object} Props
   * @property {string} label - What the row holds; used in the arrows' accessible names.
   * @property {import('svelte').Snippet} children
   */
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import STRINGS from "../../data/strings.json";

  /* One arrow tap scrolls this much of the visible width, leaving a sliver of the last card for context */
  const PAGE_FRACTION = 0.8;
  /* Sub-pixel rounding to ignore at either end before calling the row scrolled */
  const EDGE_SLACK_PX = 2;
  const T = STRINGS.swipeRow;
  const ARROW_CLASS =
    "sm:hidden absolute top-1/2 -translate-y-1/2 z-10 grid place-items-center w-8 h-8 rounded-full border border-line bg-card/90 text-ink shadow-lg backdrop-blur focus-visible:outline-2 focus-visible:outline-alert";

  /** @type {Props} */
  let { label, children } = $props();

  /** @type {HTMLDivElement | undefined} */
  let scroller = $state();
  // Server render assumes the row starts at the left with more to the right, which is how it hydrates
  let canBack = $state(false);
  let canForward = $state(true);

  function update() {
    if (!scroller) return;
    canBack = scroller.scrollLeft > EDGE_SLACK_PX;
    canForward = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - EDGE_SLACK_PX;
  }

  /** @param {1 | -1} direction */
  function page(direction) {
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * PAGE_FRACTION, behavior: "smooth" });
  }

  $effect(update);
</script>

<svelte:window onresize={update} />

<div class="relative">
  <div
    bind:this={scroller}
    onscroll={update}
    class="relative overflow-x-auto overscroll-x-contain scrollbar-none snap-x snap-mandatory scroll-px-4 -mx-4 px-4
      sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0"
  >
    {@render children()}
  </div>

  {#if canBack}
    <button type="button" onclick={() => page(-1)} aria-label="{T.back} {label}" class="{ARROW_CLASS} -left-2">
      <ChevronLeft class="w-5 h-5" aria-hidden="true" />
    </button>
  {/if}
  {#if canForward}
    <button type="button" onclick={() => page(1)} aria-label="{T.forward} {label}" class="{ARROW_CLASS} -right-2">
      <ChevronRight class="w-5 h-5" aria-hidden="true" />
    </button>
  {/if}
</div>
