// Shared settings for react-scroll links (navbar, hero mouse button, "Contact me" button).
// Having one place keeps every in-page jump feeling the same.

import { useEffect, useState } from "react";

// Used before the navbar has been measured (first render)
const FALLBACK_NAV_HEIGHT = 70;

const measureNavHeight = () => {
  const nav = typeof document !== "undefined" && document.getElementById("navbar");
  return nav ? Math.round(nav.getBoundingClientRect().height) : FALLBACK_NAV_HEIGHT;
};

// The offset react-scroll applies when it jumps to a section: the negative height of the fixed
// navbar, so a section's top lands just below the bar instead of partly behind it. The navbar is
// about 125px tall on desktop and 78px on phones, so it is measured (and re-measured on resize)
// rather than hard-coded. Previously a fixed 70px was used, which left section headings only
// ~20px under the desktop navbar after every jump.
export function useScrollOffset() {
  const [offset, setOffset] = useState(-FALLBACK_NAV_HEIGHT);

  useEffect(() => {
    // 2px short of the full height so the section lands just past its top edge: react-scroll's
    // "which link is active" check is inclusive at that edge, and rounding could otherwise leave
    // the previous section's link highlighted
    const update = () => setOffset(-(measureNavHeight() - 2));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return offset;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// react-scroll calls this with the distance (px) it is about to travel.
// Short hops are quick, long jumps take a bit longer, but never feel sluggish.
export const scrollDuration = distance => {
  if (prefersReducedMotion()) return 0;
  return Math.min(700, Math.max(250, Math.abs(distance) * 0.35));
};
