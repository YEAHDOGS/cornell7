<script>
  /**
   * Section navigation. Bottom tab bar (thumb reach) on portrait phones; vertical icon rail on landscape phones;
   * labelled side rail on tablets and up; scaled-up rail on TVs.
   * @typedef {Object} Props
   * @property {HTMLElement | undefined} scrollRoot - The scrolling <main>.
   */
  import FileText from "@lucide/svelte/icons/file-text";
  import Users from "@lucide/svelte/icons/users";
  import MessageSquare from "@lucide/svelte/icons/message-square";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import { watchSections } from "./sectionSpy.js";
  import STRINGS from "../../data/strings.json";

  /** @type {Props} */
  let { scrollRoot } = $props();

  const T = STRINGS.nav;
  const ITEMS = [
    { id: "overview", label: T.overview, icon: FileText },
    { id: "dossiers", label: T.dossiers, icon: Users },
    { id: "timeline", label: T.timeline, icon: MessageSquare },
    { id: "sources", label: T.sources, icon: BookOpen },
  ];

  let current = $state(ITEMS[0].id);

  $effect(() => {
    if (!scrollRoot) return;
    return watchSections(scrollRoot, ITEMS.map((i) => i.id), (id) => (current = id));
  });

  /** @param {MouseEvent} event @param {string} id */
  function jump(event, id) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    current = id;
  }
</script>

<nav
  aria-label={T.label}
  class="shrink-0 order-last border-t border-line bg-card/95 backdrop-blur
    landscape-phone:order-first landscape-phone:border-t-0 landscape-phone:border-r landscape-phone:w-16
    md:order-first md:border-t-0 md:border-r md:w-48 lg:w-56 2xl:w-96"
>
  <p
    class="hidden md:flex landscape-phone:flex items-center justify-center md:justify-start gap-2 px-2 md:px-5 2xl:px-10 pt-4 pb-3 md:pt-6 md:pb-6 2xl:pt-12 2xl:pb-12
      font-mono font-bold tracking-[0.2em] text-alert text-sm 2xl:text-3xl"
  >
    C7<span class="hidden md:inline landscape-phone:hidden text-muted font-normal tracking-widest text-[10px] 2xl:text-lg">{T.caseFile}</span>
  </p>

  <ul class="grid grid-cols-4 landscape-phone:grid-cols-1 md:grid-cols-1 md:gap-1 md:px-3 landscape-phone:px-0 2xl:px-6 2xl:gap-3">
    {#each ITEMS as item (item.id)}
      {@const Icon = item.icon}
      <li>
        <a
          href="#{item.id}"
          onclick={(e) => jump(e, item.id)}
          aria-current={current === item.id ? "location" : undefined}
          class="flex flex-col md:flex-row items-center gap-1 md:gap-3 2xl:gap-5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] landscape-phone:py-3 md:py-2.5 md:px-3 2xl:py-5 2xl:px-5 md:rounded-lg
            landscape-phone:flex-col landscape-phone:px-0 landscape-phone:rounded-none
            text-[10px] landscape-phone:text-[9px] md:text-sm 2xl:text-2xl transition-colors focus-visible:outline-2 focus-visible:outline-alert
            {current === item.id ? 'text-alert md:bg-card-hover' : 'text-muted hover:text-ink'}"
        >
          <Icon class="w-5 h-5 2xl:w-8 2xl:h-8" aria-hidden="true" />
          <span class="landscape-phone:sr-only">{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>
