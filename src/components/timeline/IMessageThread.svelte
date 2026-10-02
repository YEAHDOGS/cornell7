<script>
  /**
   * iMessage replica (iOS dark mode): centered contact header, gray service/time stamps, blue sent and gray
   * received bubbles grouped by sender with a tail on the last bubble of each run, and the iMessage composer.
   * @typedef {Object} Props
   * @property {import('./timeline.js').Chain} chain
   * @property {string} dateLabel - Event date, used in the timestamp header.
   */
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Video from "@lucide/svelte/icons/video";
  import Plus from "@lucide/svelte/icons/plus";
  import Mic from "@lucide/svelte/icons/mic";
  import { avatarInitials } from "./timeline.js";
  import { dossierIdForName } from "./dossierLinks.js";
  import { openDossier } from "../../lib/dossierView.svelte.js";
  import DossierName from "./DossierName.svelte";
  import CitedText from "../ui/CitedText.svelte";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { chain, dateLabel } = $props();

  const T = STRINGS.timeline;
  const contact = $derived(chain.contact || chain.thread);
  const contactId = $derived(dossierIdForName(contact));
  const otherSenders = $derived(new Set(chain.messages.filter((m) => m.sender !== chain.perspective).map((m) => m.sender)));
  const rows = $derived(
    chain.messages.map((message, i) => {
      const prev = chain.messages[i - 1];
      const next = chain.messages[i + 1];
      const mine = message.sender === chain.perspective;
      return {
        message,
        mine,
        firstOfRun: !prev || prev.sender !== message.sender,
        tail: !next || next.sender !== message.sender || !!message.note,
        // Received runs get a sender label only in group threads, as in iOS
        showName: !mine && otherSenders.size > 1 && (!prev || prev.sender !== message.sender),
        stamp: message.time ? `${dateLabel} at ${message.time}` : "",
      };
    }),
  );
  const leadStamp = $derived(rows.length && rows[0].stamp ? "" : dateLabel);
</script>

<div class="font-imsg bg-imsg-bg text-white rounded-[1.75rem] 2xl:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
  <div class="relative flex justify-center pt-2.5 pb-2 2xl:pt-5 2xl:pb-4 bg-imsg-bar/90 border-b border-white/5">
    <ChevronLeft aria-hidden="true" class="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 2xl:w-11 2xl:h-11 text-imsg-sent" />
    {#snippet contactCard()}
      <span
        aria-hidden="true"
        class="imsg-avatar grid place-items-center w-11 h-11 2xl:w-20 2xl:h-20 rounded-full text-white font-semibold text-[17px] 2xl:text-3xl tracking-wide"
      >
        {avatarInitials(contact)}
      </span>
      <span class="mt-1 flex items-center gap-0.5 text-[11px] 2xl:text-lg text-white/90">
        <span class={contactId ? "underline decoration-dotted underline-offset-2" : ""}>{contact}</span>
        <ChevronRight aria-hidden="true" class="w-3 h-3 2xl:w-5 2xl:h-5 text-imsg-dim" />
      </span>
    {/snippet}
    {#if contactId}
      <!-- Tapping the contact opens their dossier, like iMessage opens the contact card -->
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label="Open dossier: {contact}"
        onclick={() => contactId && openDossier(contactId)}
        class="flex flex-col items-center cursor-pointer rounded-lg px-2 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-imsg-sent"
      >
        {@render contactCard()}
      </button>
    {:else}
      <div class="flex flex-col items-center px-2">{@render contactCard()}</div>
    {/if}
    <Video aria-hidden="true" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 2xl:w-10 2xl:h-10 text-imsg-sent" />
  </div>

  <ol aria-label="{T.imsgService}: {chain.thread}" class="flex flex-col px-3 pt-3 pb-4 2xl:px-6 2xl:pt-6 2xl:pb-8">
    {#if leadStamp}
      <li class="text-center text-[11px] 2xl:text-lg text-imsg-dim mb-2 2xl:mb-4">
        <span class="font-semibold">{T.imsgService}</span><br />{leadStamp}
      </li>
    {/if}
    {#each rows as { message, mine, firstOfRun, tail, showName, stamp }, i (i)}
      {#if stamp}
        <li class="text-center text-[11px] 2xl:text-lg text-imsg-dim {i === 0 ? 'mb-2' : 'mt-3 mb-2'} 2xl:my-4">
          {#if i === 0}<span class="font-semibold">{T.imsgService}</span><br />{/if}{stamp}
        </li>
      {/if}
      <li class="flex flex-col {mine ? 'items-end' : 'items-start'} {firstOfRun && i > 0 && !stamp ? 'mt-2.5 2xl:mt-5' : 'mt-0.5 2xl:mt-1'}">
        {#if showName}
          <span class="ml-3 mb-0.5 text-[11px] 2xl:text-lg text-imsg-dim"><DossierName name={message.sender} /></span>
        {/if}
        <p
          class="bubble relative max-w-[78%] px-3 py-[7px] 2xl:px-5 2xl:py-3 rounded-[18px] 2xl:rounded-[28px] text-[15px] 2xl:text-2xl leading-[1.3] break-words whitespace-pre-wrap
            {mine ? 'bg-imsg-sent text-white sent' : 'bg-imsg-received text-white received'} {tail ? 'tail' : ''}"
        >
          <span class="relative z-[2]">{message.text}</span>
        </p>
        {#if message.note}
          <span class="mt-0.5 max-w-[85%] text-[10px] 2xl:text-base italic text-imsg-dim leading-snug {mine ? 'text-right mr-1' : 'ml-1'}">
            <span class="not-italic font-mono uppercase tracking-widest">{T.editorNote}:</span> <CitedText text={message.note} />
          </span>
        {/if}
      </li>
    {/each}
  </ol>

  <div aria-hidden="true" class="flex items-center gap-2 2xl:gap-4 px-3 py-2 2xl:px-6 2xl:py-4">
    <span class="grid place-items-center w-8 h-8 2xl:w-14 2xl:h-14 rounded-full bg-imsg-received text-imsg-dim">
      <Plus class="w-5 h-5 2xl:w-8 2xl:h-8" />
    </span>
    <span class="flex-1 min-w-0 flex items-center justify-between gap-2 rounded-full border border-white/15 px-3 py-1.5 2xl:px-6 2xl:py-3 text-[15px] 2xl:text-2xl text-imsg-dim">
      <span class="truncate">{T.imsgPlaceholder}</span>
      <Mic class="shrink-0 w-4 h-4 2xl:w-7 2xl:h-7" />
    </span>
  </div>
</div>

<style>
  .imsg-avatar {
    background: linear-gradient(180deg, var(--color-imsg-avatar-from), var(--color-imsg-avatar-to));
  }

  /* iOS bubble tails: a colored curl, then a background-colored cut-out on top of it */
  .bubble.tail::before,
  .bubble.tail::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 20px;
  }

  .bubble.tail::before {
    z-index: 0;
    width: 20px;
  }

  .bubble.tail::after {
    z-index: 1;
    width: 10px;
    background: var(--color-imsg-bg);
  }

  .bubble.sent.tail::before {
    right: -7px;
    background: var(--color-imsg-sent);
    border-bottom-left-radius: 16px 14px;
  }

  .bubble.sent.tail::after {
    right: -10px;
    border-bottom-left-radius: 10px;
  }

  .bubble.received.tail::before {
    left: -7px;
    background: var(--color-imsg-received);
    border-bottom-right-radius: 16px 14px;
  }

  .bubble.received.tail::after {
    left: -10px;
    border-bottom-right-radius: 10px;
  }
</style>
