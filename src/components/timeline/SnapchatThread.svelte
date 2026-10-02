<script>
  /**
   * Snapchat group-chat replica (dark mode): header with group avatar + call icons, uppercase colored sender
   * names, colored left rails per sender, quoted-reply previews, and the "Send a chat" composer.
   * Decorative chrome is aria-hidden; the transcript itself is a semantic list.
   * @typedef {Object} Props
   * @property {import('./timeline.js').Chain} chain
   */
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import Phone from "@lucide/svelte/icons/phone";
  import Video from "@lucide/svelte/icons/video";
  import Users from "@lucide/svelte/icons/users";
  import Camera from "@lucide/svelte/icons/camera";
  import Mic from "@lucide/svelte/icons/mic";
  import Smile from "@lucide/svelte/icons/face-grinning";
  import Sticker from "@lucide/svelte/icons/sticker";
  import { snapSenderColors } from "./timeline.js";
  import DossierName from "./DossierName.svelte";
  import CitedText from "../ui/CitedText.svelte";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { chain } = $props();

  const T = STRINGS.timeline;
  const ICON = "w-5 h-5 2xl:w-8 2xl:h-8";
  const colors = $derived(snapSenderColors(chain.messages));
  const rows = $derived(
    chain.messages.map((message, i) => ({
      message,
      color: colors.get(message.sender) || { text: "", border: "" },
      quoteColor: message.quote ? colors.get(message.quote.sender) || { text: "", border: "" } : null,
      showSender: i === 0 || chain.messages[i - 1].sender !== message.sender,
    })),
  );
</script>

<div class="font-snap bg-snap-bg text-snap-text rounded-[1.75rem] 2xl:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
  <div aria-hidden="true" class="flex items-center gap-2 2xl:gap-4 px-3 py-2.5 2xl:px-6 2xl:py-5 bg-snap-bg border-b border-white/5">
    <ChevronLeft class="{ICON} -ml-1" />
    <span class="shrink-0 grid place-items-center w-8 h-8 2xl:w-14 2xl:h-14 rounded-full bg-snap text-snap-ink">
      <Users class="w-4 h-4 2xl:w-7 2xl:h-7" />
    </span>
    <span class="min-w-0 font-bold text-[15px] 2xl:text-2xl truncate">{chain.thread.replace(/ \(.*\)$/, "")}</span>
    <span class="ml-auto shrink-0 flex items-center gap-2 2xl:gap-4">
      <span class="grid place-items-center w-8 h-8 2xl:w-12 2xl:h-12 rounded-full bg-snap-field"><Phone class="w-4 h-4 2xl:w-6 2xl:h-6" /></span>
      <span class="grid place-items-center w-8 h-8 2xl:w-12 2xl:h-12 rounded-full bg-snap-field"><Video class="w-4 h-4 2xl:w-6 2xl:h-6" /></span>
    </span>
  </div>

  <ol aria-label="{T.snapchat}: {chain.thread}" class="flex flex-col px-3 pt-3 pb-4 2xl:px-6 2xl:pt-6 2xl:pb-8">
    {#each rows as { message, color, quoteColor, showSender }, i (i)}
      <li class={showSender && i > 0 ? "mt-2.5 2xl:mt-5" : "mt-0.5 2xl:mt-1"}>
        {#if showSender}
          <p class="flex items-baseline gap-2 text-[11px] 2xl:text-lg font-bold uppercase tracking-wide mb-0.5 {color.text}">
            <DossierName name={message.sender} />
            {#if message.time}<span class="font-semibold normal-case tracking-normal text-snap-dim">{message.time}</span>{/if}
          </p>
        {/if}
        <div class="border-l-2 2xl:border-l-4 pl-2 2xl:pl-4 {color.border}">
          {#if message.quote && quoteColor}
            <div class="border-l-2 2xl:border-l-4 border-snap-dim/50 pl-2 2xl:pl-4 my-1 2xl:my-2">
              <p class="flex items-baseline gap-2 text-[10px] 2xl:text-base font-bold uppercase tracking-wide opacity-80 {quoteColor.text}">
                <DossierName name={message.quote.sender} />
                {#if message.quote.time}<span class="font-semibold normal-case tracking-normal text-snap-dim">{message.quote.time}</span>{/if}
              </p>
              <p class="text-[14px] 2xl:text-xl text-snap-text/80 leading-snug break-words">{message.quote.text}</p>
            </div>
          {/if}
          <p class="text-[15px] 2xl:text-2xl leading-snug break-words whitespace-pre-wrap">{message.text}</p>
        </div>
        {#if message.note}
          <p class="mt-0.5 pl-2.5 2xl:pl-5 text-[10px] 2xl:text-base italic text-snap-dim leading-snug">
            <span class="not-italic font-mono uppercase tracking-widest">{T.editorNote}:</span> <CitedText text={message.note} />
          </p>
        {/if}
      </li>
    {/each}
  </ol>

  <div aria-hidden="true" class="flex items-center gap-2 2xl:gap-4 px-3 py-2.5 2xl:px-6 2xl:py-5 bg-snap-bar">
    <span class="shrink-0 grid place-items-center w-9 h-9 2xl:w-14 2xl:h-14 rounded-full bg-snap-field"><Camera class={ICON} /></span>
    <span class="flex-1 min-w-0 flex items-center justify-between gap-2 rounded-full bg-snap-field px-3.5 py-2 2xl:px-6 2xl:py-3.5 text-[14px] 2xl:text-xl text-snap-dim">
      <span class="truncate">{T.snapPlaceholder}</span>
      <Mic class="shrink-0 w-4 h-4 2xl:w-7 2xl:h-7" />
    </span>
    <Smile class={ICON} />
    <Sticker class={ICON} />
  </div>
</div>
