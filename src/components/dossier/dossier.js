/**
 * Shapes of the records in data/people.json, shared by the dossier components.
 *
 * @typedef {Object} Fact
 * @property {string} label
 * @property {string} value - May contain citation markup.
 *
 * @typedef {Object} Person
 * @property {string} id
 * @property {string} name
 * @property {"plaintiff" | "defendant" | "institution"} role
 * @property {"individual" | "institutional"} group - Which row of the dossier grid it sits in.
 * @property {string} [fileLabel] - Fixed tile label (institutions); defendants are numbered automatically.
 * @property {string} initials
 * @property {string} tagline - One-line role summary shown on the tile.
 * @property {string[]} aliases - Names that link to this dossier from the timeline (first mention per entry).
 * @property {Fact[]} facts - Key/value header rows (counsel, Title IX outcome, etc.).
 * @property {string[]} alleged - What the complaint alleges.
 * @property {string[]} response - Public denials / statements / reported outcomes.
 * @property {string[]} sources - Ids from data/sources.json.
 */

const PLAINTIFF_LABEL = "PLAINTIFF";
const DEFENDANT_LABEL = "DEFENDANT";
const LABEL_PAD = 2;

/**
 * File label for a tile: the plaintiff is unnumbered, records with a fixed `fileLabel` keep it, and the
 * remaining (individual) defendants are numbered in complaint order.
 * @param {Person[]} people
 * @returns {Map<string, string>} person id -> label
 */
export function buildFileLabels(people) {
  const labels = new Map();
  let count = 0;
  for (const person of people) {
    if (person.role === "plaintiff") {
      labels.set(person.id, PLAINTIFF_LABEL);
      continue;
    }
    if (person.fileLabel) {
      labels.set(person.id, person.fileLabel);
      continue;
    }
    count += 1;
    labels.set(person.id, `${DEFENDANT_LABEL} ${String(count).padStart(LABEL_PAD, "0")}`);
  }
  return labels;
}
