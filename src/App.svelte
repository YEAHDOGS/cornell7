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

<!-- px-*: an even bezel on both screen edges, so the nav rail and the scrollbar never sit flush against the glass -->
<div
  class="app-shell h-dvh w-full flex flex-col landscape-phone:flex-row md:flex-row bg-app text-ink overflow-hidden
    px-1 landscape-phone:px-1.5 md:px-2 xl:px-3 2xl:px-6"
>
  <SectionNav {scrollRoot} />

  <!-- relative: absolutely positioned descendants (sr-only labels) must live inside this scroller. Otherwise they
       hang off the page body, give the document its own scroll overflow, and anchor jumps to the last section scroll
       the whole layout up past the viewport.
       No scroll-smooth: it would animate direct #section links across the whole page on load. Nav clicks ask for
       smooth scrolling themselves (SectionNav.svelte). -->
  <main bind:this={scrollRoot} class="relative flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
    <div
      class="mx-auto max-w-7xl 2xl:max-w-[2400px] flex flex-col gap-12 sm:gap-14 landscape-phone:gap-10 2xl:gap-24
        px-4 py-6 sm:px-6 landscape-phone:px-4 landscape-phone:py-4 md:px-8 md:py-10 xl:px-12 2xl:px-20 2xl:py-16"
    >
      <CaseOverview />
      <figure class="flex flex-col gap-2 2xl:gap-4">
        <img
          src="/images/da-sworn-account.jpg"
          alt="Pages 4 and 5 of the Tompkins County District Attorney's September 28, 2026 public statement, quoting Jane Doe's sworn account of the night"
          class="mx-auto w-full max-w-2xl 2xl:max-w-4xl rounded-lg border border-line"
          loading="lazy"
        />
        <figcaption class="mx-auto max-w-2xl 2xl:max-w-4xl text-[11px] sm:text-xs 2xl:text-lg text-muted leading-relaxed">
          DA public statement (Sept 28, 2026), pp. 4–5: Jane Doe's sworn account of the night, as quoted by the DA's office. Full document in primary sources.
        </figcaption>
      </figure>
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
  /* h-dvh needs Chrome 108+; older browsers fall back to vh */
  @supports not (height: 100dvh) {
    .app-shell {
      height: 100vh;
    }
  }</style>
