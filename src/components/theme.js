// Light or dark. The colours are in styles/theme.css, and in PALETTES below for the hero's canvas.
// index.html applies the saved choice before the first paint; dark is the default.

const KEY = "theme";
const root = document.documentElement;
const listeners = new Set();

// "r,g,b" so the canvas can add its own alpha
const PALETTES = {
  dark: {
    name: "249,241,233",
    block: "240,184,96", // blocks on their way to the name
    star: "249,241,233",
    starAlpha: 1,
    tag: "11,13,20",
    gold: "255,196,99",
    teal: "127,219,230",
    cream: "241,236,224",
    lit: "255,210,122",
    head: "255,250,240", // the first dot of a transfer
    line: "233,180,101", // the line that runs on into About: the same as --gold
    // the top, left and right faces of each colour
    faces: {
      gold: { top: "#4d3a1a", left: "#382a13", right: "#281d0c" },
      teal: { top: "#1d4150", left: "#14303c", right: "#0e222c" },
      cream: { top: "#2d384b", left: "#202938", right: "#171d2a" },
    },
  },
  light: {
    name: "20,32,58",
    block: "214,137,16",
    star: "20,32,58",
    starAlpha: 0.3,
    tag: "255,255,255",
    gold: "138,77,0",
    teal: "15,98,112",
    cream: "34,48,77",
    lit: "179,92,0",
    head: "20,32,58",
    line: "150,89,10",
    // the top, left and right faces of each colour
    faces: {
      gold: { top: "#fff0d2", left: "#f5d99f", right: "#e8c17a" },
      teal: { top: "#d3eef1", left: "#b4dde2", right: "#94cad1" },
      cream: { top: "#ffffff", left: "#dde4ef", right: "#bfcadb" },
    },
  },
};

export const getTheme = () => (root.dataset.theme === "light" ? "light" : "dark");
export const getPalette = () => PALETTES[getTheme()];

export function onThemeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function apply(theme) {
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(root).getPropertyValue("--page").trim();
  listeners.forEach(fn => fn());
}

// follow a change made in another tab
window.addEventListener("storage", e => {
  if (e.key === KEY) apply(e.newValue === "light" ? "light" : "dark");
});

export function setTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // private window or blocked storage: it lasts until the page is closed
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !still) {
    // a cross-fade that is cut short (by another click) rejects; the theme still changes
    document.startViewTransition(() => apply(theme)).ready.catch(() => {});
  } else {
    apply(theme);
  }
}
