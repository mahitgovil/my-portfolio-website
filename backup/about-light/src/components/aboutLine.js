// The line through About and Experience. It leaves the hero's machines, runs through the tech stack
// and on to each job. It draws itself with the scroll, and whatever it has not reached yet is a
// faint wireframe.

import { getHeroExit, onHeroExit } from "./heroExit";

const READING_LINE = 0.64; // how far down the screen the line has got
const SLOPE = 1 / Math.sqrt(3); // the angle of every floor line in the drawings
const WIDE = 992; // narrower than this the drawings are not next to each other: nothing to join

const clamp01 = n => Math.min(1, Math.max(0, n));

// `lead` is the <svg> that carries the line from the hero to the first job
export function startAboutLine({ section, lead }) {
  const leadLine = lead.querySelector(".route__line");
  const leadTip = lead.querySelector(".route__tip");
  const slabs = [...section.querySelectorAll(".stack__slab")];
  const layers = [...section.querySelectorAll(".stack__layer")];
  const stops = [...section.querySelectorAll(".stop")];
  const arts = stops.map(stop => stop.querySelector(".stop__art"));
  const routes = [...section.querySelectorAll(".stops .route")].map(route => {
    const line = route.querySelector(".route__line");
    return { line, tip: route.querySelector(".route__tip"), length: line.getTotalLength() };
  });
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let points = null; // of the lead, relative to the section
  let lengths = []; // along the lead, up to each point
  let frame = 0;

  function layout() {
    const box = section.getBoundingClientRect();
    const exit = getHeroExit();
    points = null;
    if (window.innerWidth >= WIDE && exit !== null) {
      const rel = el => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - box.left + r.width / 2,
          top: r.top - box.top,
          bottom: r.bottom - box.top,
          h: r.height,
        };
      };
      const first = rel(slabs[0]);
      const last = rel(slabs[slabs.length - 1]);
      const art = rel(arts[0]);
      const artY = art.top + art.h / 2;
      const across = Math.abs(exit - first.x) * SLOPE;
      const turn = Math.max(0, Math.min(36, first.top + first.h * 0.4 - across));
      points = [
        [exit, 0],
        [exit, turn],
        [first.x, turn + across],
        [last.x, Math.max(last.bottom - last.h * 0.1, artY - Math.abs(last.x - art.x) * SLOPE)],
        [art.x, artY],
      ];
      lengths = [0];
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
      }
      const d = `M${points.map(p => p.map(n => n.toFixed(1)).join(" ")).join("L")}`;
      lead.setAttribute("width", box.width);
      lead.setAttribute("height", box.height);
      leadLine.setAttribute("d", d);
      leadTip.setAttribute("d", d);
    }
    lead.style.display = points ? "" : "none";
  }

  // how much of the lead is above this height
  function leadLength(y) {
    if (y <= 0) return 0;
    for (let i = 1; i < points.length; i++) {
      const top = points[i - 1][1];
      const bottom = points[i][1];
      if (y < bottom) {
        const t = (y - top) / (bottom - top);
        return lengths[i - 1] + t * (lengths[i] - lengths[i - 1]);
      }
    }
    return lengths[lengths.length - 1];
  }

  function draw(line, tip, drawn, length) {
    line.style.strokeDasharray = `${drawn} ${length + 1}`;
    tip.style.strokeDasharray = `0.01 ${length + 10}`;
    tip.style.strokeDashoffset = -drawn;
    tip.style.opacity = drawn > 0 && drawn < length ? 1 : 0;
  }

  function update() {
    frame = 0;
    const h = window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top;
    // starts at the bottom edge of the screen, so it carries straight on from the hero's line
    const y = h * (READING_LINE + (1 - READING_LINE) * clamp01(sectionTop / h));

    // read every position first, then write
    const progress = routes.map(({ line }) => {
      const r = line.getBoundingClientRect();
      return r.height ? clamp01((y - r.top) / r.height) : 0;
    });
    const layerLit = slabs.map(slab => {
      const r = slab.getBoundingClientRect();
      return r.top + r.height * 0.3 < y;
    });
    const stopLit = arts.map(art => {
      const r = art.getBoundingClientRect();
      return r.top + r.height * 0.4 < y;
    });

    if (points) draw(leadLine, leadTip, leadLength(y - sectionTop), lengths[lengths.length - 1]);
    routes.forEach(({ line, tip, length }, i) => draw(line, tip, progress[i] * length, length));
    layers.forEach((el, i) => el.classList.toggle("is-lit", layerLit[i]));
    stops.forEach((el, i) => el.classList.toggle("is-lit", stopLit[i]));
  }

  const request = () => {
    if (!still && !frame) frame = requestAnimationFrame(update);
  };
  const relayout = () => {
    layout();
    request();
  };

  layout();
  if (still) {
    [...layers, ...stops].forEach(el => el.classList.add("is-lit"));
    [leadTip, ...routes.map(r => r.tip)].forEach(tip => (tip.style.opacity = 0));
  } else {
    update();
    window.addEventListener("scroll", request, { passive: true });
  }
  const observer = new ResizeObserver(relayout);
  observer.observe(section);
  window.addEventListener("resize", relayout);
  const offExit = onHeroExit(relayout);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", relayout);
    observer.disconnect();
    offExit();
  };
}
