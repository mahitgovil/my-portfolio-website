// Where the line from the hero's machines crosses the bottom edge of the hero. isoView.js sets it;
// trailLine.js carries the line on from there.

let x = null;
const listeners = new Set();

export const getHeroExit = () => x;

export function setHeroExit(value) {
  if (value === x) return;
  x = value;
  listeners.forEach(fn => fn());
}

export function onHeroExit(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
