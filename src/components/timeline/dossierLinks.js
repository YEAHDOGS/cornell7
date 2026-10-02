import PEOPLE from "../../data/people.json";
import { parseCitations } from "../../lib/sources.js";

/* Every alias of every dossier, longest first so "Matthew Ingalls" wins over "Ingalls". */
const ALIASES = /** @type {any[]} */ (PEOPLE)
  .flatMap((person) => (person.aliases || []).map((/** @type {string} */ alias) => ({ alias, id: person.id })))
  .sort((a, b) => b.alias.length - a.alias.length);
const ID_BY_ALIAS = new Map(ALIASES.map((a) => [a.alias, a.id]));
const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/* Whole-word matches only; "John Doe (Faculty)" style party names must not link to the plaintiff. */
const ALIAS_PATTERN = new RegExp(`(?<![\\w])(?<!John )(${ALIASES.map((a) => escape(a.alias)).join("|")})(?![\\w])`, "g");

/* Full names only (aliases with a space), case-insensitive, for chat sender labels like "SCOTT NORRIS".
   Partial or uncertain display names ("WINSTON", "[J]ONATHAN N··L") deliberately stay unlinked. */
const ID_BY_FULL_NAME = new Map(ALIASES.filter((a) => a.alias.includes(" ")).map((a) => [a.alias.toLowerCase(), a.id]));

/**
 * Dossier id for a chat participant's display name, or undefined when it isn't an exact full-name match.
 * @param {string} name
 * @returns {string | undefined}
 */
export function dossierIdForName(name) {
  return ID_BY_FULL_NAME.get(name.trim().toLowerCase());
}

/**
 * Parses citation markup in each paragraph of one timeline entry, then links the FIRST mention of each
 * dossier (person, organization or place) across the whole entry. Citation labels are never re-linked.
 * @param {string[]} paragraphs
 * @returns {import("../../lib/sources.js").TextSegment[][]}
 */
export function linkFirstMentions(paragraphs) {
  const seen = new Set();
  return paragraphs.map((paragraph) =>
    parseCitations(paragraph).flatMap((segment) => {
      if ("href" in segment) return [segment];
      /** @type {import("../../lib/sources.js").TextSegment[]} */
      const out = [];
      let last = 0;
      for (const match of segment.text.matchAll(ALIAS_PATTERN)) {
        const id = ID_BY_ALIAS.get(match[1]);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const index = match.index || 0;
        if (index > last) out.push({ text: segment.text.slice(last, index) });
        out.push({ text: match[1], dossier: id });
        last = index + match[1].length;
      }
      if (last < segment.text.length) out.push({ text: segment.text.slice(last) });
      return out;
    }),
  );
}
