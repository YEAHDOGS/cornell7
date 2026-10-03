<script>
  /**
   * Case caption, legal-status notice, and headline figures. All copy lives in data/case.json.
   */
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import CASE from "../../data/case.json";
  import CitedText from "../ui/CitedText.svelte";
  import PrimarySources from "../sources/PrimarySources.svelte";
</script>

<section id="overview" aria-labelledby="overview-title" class="scroll-mt-4 flex flex-col gap-5 2xl:gap-10">
  <header class="flex flex-col gap-2 2xl:gap-4">
    <p class="font-mono text-[10px] sm:text-xs 2xl:text-xl tracking-[0.2em] text-alert">{CASE.court}</p>
    <h1 id="overview-title" class="text-2xl sm:text-3xl landscape-phone:text-2xl lg:text-4xl 2xl:text-7xl font-bold text-ink leading-tight">
      {CASE.caption}
    </h1>
    {#each CASE.lead as paragraph, i (i)}
      <p class="text-sm sm:text-base 2xl:text-3xl text-ink/90 leading-relaxed {i === 0 ? 'mt-2 2xl:mt-4' : ''}">
        <CitedText text={paragraph} />
      </p>
    {/each}
    <div class="my-3 2xl:my-6"><PrimarySources /></div>
    <p class="text-sm sm:text-base 2xl:text-3xl text-ink/90 leading-relaxed"><CitedText text={CASE.defendantsIntro} /></p>
    <dl
      class="grid grid-cols-1 sm:grid-cols-2 landscape-phone:grid-cols-3 md:grid-cols-3 xl:grid-cols-7 gap-2 lg:gap-3 2xl:gap-6"
    >
      {#each CASE.defendantGroups as group (group.label)}
        <div class="rounded-lg border border-line bg-card px-3 py-2 2xl:px-6 2xl:py-4 {group.label === 'Students' ? 'xl:col-span-2' : ''}">
          <dt class="font-mono text-[9px] sm:text-[10px] 2xl:text-base tracking-[0.15em] uppercase text-muted mb-1">{group.label}</dt>
          {#each group.names as name (name)}
            <dd class="text-xs sm:text-[13px] 2xl:text-xl text-ink leading-snug">{name}</dd>
          {/each}
        </div>
      {/each}
    </dl>
    <p class="font-mono text-[11px] sm:text-xs 2xl:text-xl text-muted leading-relaxed"><CitedText text={CASE.counsel} /></p>
  </header>

  <aside
    role="note"
    class="flex gap-3 2xl:gap-6 rounded-lg border border-cat-aftermath/40 bg-cat-aftermath/5 p-3 sm:p-4 2xl:p-8"
  >
    <TriangleAlert class="w-5 h-5 2xl:w-9 2xl:h-9 shrink-0 text-cat-aftermath mt-0.5" aria-hidden="true" />
    <div class="flex flex-col gap-1.5 text-xs sm:text-sm 2xl:text-2xl leading-relaxed text-ink/85">
      {#each CASE.notices as notice, i (i)}
        <p><CitedText text={notice} /></p>
      {/each}
    </div>
  </aside>

  <dl class="grid grid-cols-2 sm:grid-cols-4 landscape-phone:grid-cols-4 gap-2 lg:gap-4 2xl:gap-8">
    {#each CASE.figures as figure (figure.label)}
      <div class="rounded-lg border border-line bg-card px-3 py-2.5 sm:px-4 sm:py-3 2xl:px-8 2xl:py-6">
        <dt class="font-mono text-[9px] sm:text-[10px] 2xl:text-base tracking-[0.15em] uppercase text-muted">{figure.label}</dt>
        <dd class="text-lg sm:text-xl lg:text-2xl 2xl:text-5xl font-bold text-ink">{figure.value}</dd>
        {#if figure.detail}<dd class="text-[10px] sm:text-xs 2xl:text-lg text-muted leading-snug"><CitedText text={figure.detail} /></dd>{/if}
      </div>
    {/each}
  </dl>

  {#if CASE.closing}
    <div class="border-t border-line pt-5 2xl:pt-10">
      {#each CASE.closing as paragraph, i (i)}
        <p class="text-sm sm:text-base 2xl:text-3xl text-ink/90 leading-relaxed {i === 0 ? '' : 'mt-3 2xl:mt-6'}">
          <CitedText text={paragraph} />
        </p>
      {/each}
    </div>
  {/if}
</section>
