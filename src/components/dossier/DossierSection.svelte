<script>
  /**
   * Square dossier tiles in two rows (plaintiff + the seven accused, then institutional and supervisory
   * defendants) with one shared SlidePanel. The open dossier lives in lib/dossierView so names linked
   * elsewhere (the timeline) open it in place.
   */
  import DossierCard from "./DossierCard.svelte";
  import DossierDetail from "./DossierDetail.svelte";
  import SlidePanel from "../ui/SlidePanel.svelte";
  import SwipeRow from "../ui/SwipeRow.svelte";
  import { buildFileLabels } from "./dossier.js";
  import { dossierView, openDossier, closeDossier } from "../../lib/dossierView.svelte.js";
  import PEOPLE from "../../data/people.json";
  import STRINGS from "../../data/strings.json";

  const T = STRINGS.dossier;
  /** @type {import('./dossier.js').Person[]} */
  const PEOPLE_LIST = /** @type {any} */ (PEOPLE);
  const FILE_LABELS = buildFileLabels(PEOPLE_LIST);
  const GROUPS = [
    { key: "individual", title: T.individualTitle },
    { key: "institutional", title: T.institutionalTitle },
  ].map((group) => ({ ...group, people: PEOPLE_LIST.filter((p) => p.group === group.key) }));

  const selected = $derived(PEOPLE_LIST.find((p) => p.id === dossierView.id) || null);

  /* Grid columns per row from sm: up (8 people in the first row, 5 in the second). Portrait phones swipe instead. */
  const GRID_CLASS = {
    individual: "sm:grid-cols-4 landscape-phone:grid-cols-4 md:grid-cols-4 2xl:grid-cols-8",
    institutional: "sm:grid-cols-3 landscape-phone:grid-cols-5 md:grid-cols-5 2xl:grid-cols-8",
  };
</script>

<section id="dossiers" aria-labelledby="dossiers-title" class="scroll-mt-4 flex flex-col gap-4 2xl:gap-8">
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
    <h2 id="dossiers-title" class="text-lg sm:text-xl lg:text-2xl 2xl:text-5xl font-bold text-ink">{T.title}</h2>
    <p class="text-xs sm:text-sm 2xl:text-xl text-muted">{T.subtitle}</p>
  </div>

  {#each GROUPS as group (group.key)}
    <div class="flex flex-col gap-2 2xl:gap-4">
      <h3 class="font-mono text-[10px] sm:text-xs 2xl:text-lg tracking-[0.18em] uppercase text-muted">{group.title}</h3>
      <SwipeRow label={group.title}>
        <ul class="flex w-max sm:grid sm:w-auto gap-3 landscape-phone:gap-2 lg:gap-4 2xl:gap-6 {GRID_CLASS[/** @type {'individual' | 'institutional'} */ (group.key)]}">
          {#each group.people as person (person.id)}
            <!-- 38vw on phones: two and a bit tiles in view, so the next one peeks in -->
            <li class="shrink-0 w-[38vw] snap-start sm:w-auto">
              <DossierCard {person} fileLabel={FILE_LABELS.get(person.id) || ""} onopen={() => openDossier(person.id)} />
            </li>
          {/each}
        </ul>
      </SwipeRow>
    </div>
  {/each}
</section>

<SlidePanel
  bind:open={() => selected !== null, (value) => !value && closeDossier()}
  label={selected ? `${T.title}: ${selected.name}` : T.title}
>
  {#if selected}
    <DossierDetail person={selected} fileLabel={FILE_LABELS.get(selected.id) || ""} />
  {/if}
</SlidePanel>
