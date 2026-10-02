<script>
  /**
   * Reusable sliding panel built on the native <dialog> (focus trap, Esc to close, inert background for free).
   * Bottom sheet on portrait phones, right-hand drawer everywhere else. Opening pushes a history entry so the
   * mobile back-swipe / browser Back button closes the panel instead of leaving the page.
   *
   * @typedef {Object} Props
   * @property {boolean} open - Whether the panel is shown (bindable).
   * @property {string} label - Accessible name for the dialog.
   * @property {import('svelte').Snippet} children
   */
  import X from "@lucide/svelte/icons/x";

  const HISTORY_KEY = "slidePanel";

  /** @type {Props} */
  let { open = $bindable(false), label, children } = $props();

  /** @type {HTMLDialogElement | undefined} */
  let dialog = $state();

  $effect(() => {
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (dialog.open) return;
    dialog.showModal();
    dialog.scrollTop = 0;
    history.pushState({ [HISTORY_KEY]: true }, "");
  });

  /** Dialog closed by Esc or the close button: drop the history entry we pushed. */
  function handleClose() {
    open = false;
    if (history.state && history.state[HISTORY_KEY]) history.back();
  }

  /** Back gesture / Back button while open. */
  function handlePopState() {
    if (!open) return;
    open = false;
  }

  /** @param {MouseEvent} event - clicks on the backdrop land on the dialog element itself */
  function handleBackdropClick(event) {
    if (event.target !== dialog) return;
    dialog.close();
  }
</script>

<svelte:window onpopstate={handlePopState} />

<dialog
  bind:this={dialog}
  aria-label={label}
  onclose={handleClose}
  onclick={handleBackdropClick}
  class="slide-panel m-0 p-0 bg-card text-ink border-line overflow-y-auto overscroll-contain
    fixed inset-x-0 bottom-0 top-auto w-full max-w-none h-[88dvh] max-h-[88dvh] rounded-t-2xl border-t
    sm:inset-y-0 sm:left-auto sm:right-0 sm:h-dvh sm:max-h-dvh sm:w-[80vw] sm:rounded-none sm:border-t-0 sm:border-l
    landscape-phone:w-[85vw]
    md:w-[560px] lg:w-[640px] xl:w-[720px] 2xl:w-[960px]"
>
  <div class="sticky top-0 z-10 flex justify-end bg-card/90 backdrop-blur px-3 pt-3 pb-1 sm:px-4 2xl:px-8 2xl:pt-6">
    <button
      type="button"
      onclick={() => dialog && dialog.close()}
      class="p-2 rounded-lg text-muted hover:text-ink hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-alert"
      aria-label="Close panel"
    >
      <X class="w-5 h-5 2xl:w-8 2xl:h-8" />
    </button>
  </div>
  <div class="px-4 pb-8 sm:px-6 landscape-phone:px-4 md:px-8 2xl:px-12 2xl:pb-16">
    {@render children()}
  </div>
</dialog>

<style>
  .slide-panel::backdrop {
    background: rgb(0 0 0 / 70%);
  }

  .slide-panel[open] {
    animation: slide-up 220ms ease-out;
  }

  @media (min-width: 640px) {
    .slide-panel[open] {
      animation-name: slide-in;
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .slide-panel[open] {
      animation: none;
    }
  }
</style>
