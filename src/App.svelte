<script>
  import SectionNav from "./components/nav/SectionNav.svelte";
  import CaseOverview from "./components/overview/CaseOverview.svelte";
  import DossierSection from "./components/dossier/DossierSection.svelte";
  import TimelineSection from "./components/timeline/TimelineSection.svelte";
  import SourcesSection from "./components/sources/SourcesSection.svelte";
  import STRINGS from "./data/strings.json";

  const CURRENT_YEAR = new Date().getFullYear();

  /** @type {HTMLElement | undefined} */
  let scrollRoot = $state();
</script>

<div class="app-shell h-dvh w-full flex flex-col landscape-phone:flex-row md:flex-row bg-app text-ink overflow-hidden">
  <SectionNav {scrollRoot} />

  <main bind:this={scrollRoot} class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth">
    <div
      class="mx-auto max-w-7xl 2xl:max-w-[2400px] flex flex-col gap-12 sm:gap-14 landscape-phone:gap-10 2xl:gap-24
        px-4 py-6 sm:px-6 landscape-phone:px-4 landscape-phone:py-4 md:px-8 md:py-10 xl:px-12 2xl:px-20 2xl:py-16"
    >
      <CaseOverview />
      <DossierSection />
      <TimelineSection />
      <SourcesSection />

      <footer class="border-t border-line pt-4 2xl:pt-8 text-[10px] sm:text-xs 2xl:text-lg text-muted flex flex-col sm:flex-row gap-1 sm:justify-between">
        <span>{STRINGS.footer.disclaimer}</span>
        <span>&copy; {CURRENT_YEAR} DOGS</span>
      </footer>
    </div>
  </main>
</div>

<style>
  /* h-dvh needs Chrome 108+; older app-tier browsers (see APP_CSS_TARGET) fall back to vh */
  @supports not (height: 100dvh) {
    .app-shell {
      height: 100vh;
    }
  }
</style>
