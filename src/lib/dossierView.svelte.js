/**
 * Which dossier is open, shared app-wide so any component (e.g. a name linked in the timeline) can open a
 * dossier in place without scrolling the page. DossierSection renders the panel for it.
 */
export const dossierView = $state({ /** @type {string | null} */ id: null });

/** @param {string} id - Person id from data/people.json. */
export function openDossier(id) {
  dossierView.id = id;
}

export function closeDossier() {
  dossierView.id = null;
}
