/**
 * Shapes of the records in data/timeline.json plus small helpers shared by the timeline components.
 *
 * @typedef {Object} Message
 * @property {string} sender - Name as attributed in the source ("Unidentified member" when not attributed).
 * @property {string} text - Verbatim text. "[photo]"-style placeholders are given via `attachment` instead.
 * @property {string} [time]
 * @property {string} [attachment] - Description of a non-text item (photo, snap, video).
 * @property {string} [note] - Editorial note, e.g. "paraphrased in reporting".
 * @property {{ sender: string, time?: string, text: string }} [quote] - Snapchat quoted-reply preview.
 *
 * @typedef {Object} Chain
 * @property {"snapchat" | "sms"} platform
 * @property {string} thread - Thread title, e.g. "Chi Phi Actives" (Snapchat header / accessible label).
 * @property {string} [contact] - iMessage header contact name (the other party).
 * @property {string} [perspective] - Sender whose messages render on the right (the phone's owner).
 * @property {string} provenance - Where the transcript comes from.
 * @property {string} [note]
 * @property {{ source: string, page?: number }} [original] - Link to the original exhibit (opens in a new tab).
 * @property {Message[]} messages
 *
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {string} date - ISO date (sort key).
 * @property {string} dateLabel
 * @property {string} [time]
 * @property {"night" | "aftermath" | "investigation" | "campus" | "litigation"} category
 * @property {string} title
 * @property {string[]} summary
 * @property {Chain[]} chains
 * @property {string[]} sources
 */

const ISO_DATE_LENGTH = 10;
const PART_SEPARATOR = ", ";
/* A day-of-month in a date label ("Oct 18, 2024", "Nov 14–15, 2024"); "Late Oct 2024" / "Nov 2024" have none */
const DAY_OF_MONTH_PATTERN = /\b\d{1,2}\b/;
const APPROX_MARK = "≈ ";

/* Static class strings so Tailwind can see them (tokens snap-1..8 in app.css). Snapchat gives each group member
   a name + rail color; we assign them in order of first appearance so a thread never repeats a color early. */
const SNAP_SENDER_CLASSES = [
  { text: "text-snap-1", border: "border-snap-1" },
  { text: "text-snap-6", border: "border-snap-6" },
  { text: "text-snap-5", border: "border-snap-5" },
  { text: "text-snap-4", border: "border-snap-4" },
  { text: "text-snap-2", border: "border-snap-2" },
  { text: "text-snap-3", border: "border-snap-3" },
  { text: "text-snap-7", border: "border-snap-7" },
  { text: "text-snap-8", border: "border-snap-8" },
];

/**
 * Per-thread sender -> color classes, in order of first appearance (quoted senders included).
 * @param {Message[]} messages
 * @returns {Map<string, { text: string, border: string }>}
 */
export function snapSenderColors(messages) {
  const colors = new Map();
  const assign = (/** @type {string} */ name) => {
    if (colors.has(name)) return;
    colors.set(name, SNAP_SENDER_CLASSES[colors.size % SNAP_SENDER_CLASSES.length]);
  };
  for (const message of messages) {
    if (message.quote) assign(message.quote.sender);
    assign(message.sender);
  }
  return colors;
}

/**
 * Initials for an iMessage contact avatar ("Male No. 1" -> "M1", "Jane Doe" -> "JD").
 * @param {string} name
 * @returns {string}
 */
export function avatarInitials(name) {
  const words = name.replace(/["“”]/g, "").split(/\s+/).filter(Boolean);
  const first = words[0] ? words[0][0] : "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * @typedef {Object} CounterLabels - data/strings.json timeline.counter
 * @property {string} dayOf
 * @property {string} after
 * @property {string} before
 * @property {string} year
 * @property {string} years
 * @property {string} month
 * @property {string} months
 * @property {string} day
 * @property {string} days
 */

/**
 * How long before or after the incident an entry falls, in calendar terms: "Day of", "3 days after",
 * "1 year, 6 months, 30 days after". Zero parts are left out. Pure date arithmetic on the ISO strings (no time
 * zones), so the server render and every visitor read the same thing. Ranges count from their first day; entries
 * dated only to the month get a leading "≈".
 * @param {string} anchor - ISO date the count starts from (data/case.json "incidentDate").
 * @param {TimelineEvent} event - Its `date` sort key may carry a letter suffix ("2024-10-20b"), which is ignored.
 * @param {CounterLabels} labels
 * @returns {string}
 */
export function dayCounter(anchor, event, labels) {
  const key = event.date.slice(0, ISO_DATE_LENGTH);
  if (key === anchor) return labels.dayOf;
  const after = key > anchor;
  const [from, to] = (after ? [anchor, key] : [key, anchor]).map((iso) => iso.split("-").map(Number));

  let years = to[0] - from[0];
  let months = to[1] - from[1];
  let days = to[2] - from[2];
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(to[0], to[1] - 1, 0)).getUTCDate(); // length of the month before `to`'s month
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [
    [years, labels.year, labels.years],
    [months, labels.month, labels.months],
    [days, labels.day, labels.days],
  ]
    .filter(([count]) => count)
    .map(([count, one, many]) => `${count} ${count === 1 ? one : many}`);
  const approx = DAY_OF_MONTH_PATTERN.test(event.dateLabel) ? "" : APPROX_MARK;
  return `${approx}${parts.join(PART_SEPARATOR)} ${after ? labels.after : labels.before}`;
}

/** Dot / chip color per category (tokens in app.css). */
export const CATEGORY_CLASSES = {
  night: "bg-cat-night",
  aftermath: "bg-cat-aftermath",
  investigation: "bg-cat-investigation",
  campus: "bg-cat-campus",
  litigation: "bg-cat-litigation",
};
