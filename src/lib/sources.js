import SOURCES from "../data/sources.json";
import CONFIG from "../data/config.json";

/**
 * @typedef {Object} Source
 * @property {string} id
 * @property {"filing" | "official" | "citation"} kind - Sources tab grouping.
 * @property {string} short - Chip label.
 * @property {string} publisher
 * @property {string} [date]
 * @property {string} title
 * @property {string} url - Original/public location ("" when only our hosted copy exists).
 * @property {string} [doc] - File name of our self-hosted copy: site-relative (starts with "/docs/")
 *   or under CONFIG.docsBaseUrl (R2). Preferred over `url`.
 * @property {string} [mirror] - Secondary public copy.
 *
 * @typedef {{ text: string } | { text: string, href: string } | { text: string, dossier: string }} TextSegment - Plain text, a citation link, or a dossier mention (timeline only).
 */

/** Inline citation markup used in data/*.json prose: [label](source-id) or [label](source-id@pdfPage). */
const CITATION_PATTERN = /\[([^\]]+)\]\(([a-z0-9-]+)(?:@(\d+))?\)/g;

/** @type {Source[]} */
export const SOURCE_LIST = /** @type {any} */ (SOURCES);

/**
 * Link target for a source: the self-hosted R2 copy when there is one, else the original URL.
 * Every source opens in a new tab; PDFs render in the browser's own viewer there.
 * @param {Source} source
 * @param {number} [page] - PDF page to open at (#page= fragment, honored by Chromium/Firefox/Safari viewers).
 * @returns {string}
 */
export function sourceHref(source, page) {
  const base = source.doc
    ? (source.doc.startsWith("/") ? source.doc : CONFIG.docsBaseUrl + source.doc)
    : source.url;
  return page ? `${base}#page=${page}` : base;
}

/**
 * @param {string} id
 * @returns {Source | undefined}
 */
export function findSource(id) {
  return SOURCE_LIST.find((s) => s.id === id);
}

/**
 * Splits prose with citation markup into plain and linked segments. Unknown source ids render as plain text.
 * @param {string} text
 * @returns {TextSegment[]}
 */
export function parseCitations(text) {
  /** @type {TextSegment[]} */
  const segments = [];
  let last = 0;
  for (const match of text.matchAll(CITATION_PATTERN)) {
    const [whole, label, id, page] = match;
    const index = match.index || 0;
    if (index > last) segments.push({ text: text.slice(last, index) });
    const source = findSource(id);
    segments.push(source ? { text: label, href: sourceHref(source, page ? Number(page) : undefined) } : { text: label });
    last = index + whole.length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}
