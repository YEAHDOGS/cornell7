/* Band near the top of the scroll area that decides which section is "current". */
const SPY_ROOT_MARGIN = "-10% 0px -80% 0px";

/**
 * Watches section elements inside a scroll container and reports the one crossing the top band.
 * Falls back to a no-op where IntersectionObserver is missing (nav still works, just without highlighting).
 * @param {HTMLElement} root - The scrolling element.
 * @param {string[]} ids - Section element ids, in page order.
 * @param {(id: string) => void} onchange
 * @returns {() => void} cleanup
 */
export function watchSections(root, ids, onchange) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.find((entry) => entry.isIntersecting);
      if (hit) onchange(hit.target.id);
    },
    { root, rootMargin: SPY_ROOT_MARGIN },
  );
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }
  return () => observer.disconnect();
}
