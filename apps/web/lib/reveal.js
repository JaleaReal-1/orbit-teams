// Progressive enhancement: no hidden state, even when JavaScript or the observer fails.
const observed = new WeakSet();
export function revealSections(root = document) {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches)
    return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  root
    .querySelectorAll('main > section:not(.hero):not(.projects-intro):not(.detail-hero)')
    .forEach((section) => {
      if (observed.has(section)) return;
      observed.add(section);
      observer.observe(section);
    });
}
