// The line from the hero's machines. It lands in the room in About and runs on into the file in Tech
// stack, drawing itself with the scroll. The room stays dim until it gets there.

import { getHeroExit, onHeroExit } from "./heroExit";

const READING_LINE = 0.64; // how far down the screen the line has got
const SLOPE = 1 / Math.sqrt(3); // the angle of every floor line in the drawings
const WIDE = 992; // narrower than this it runs straight down the left edge

const clamp01 = n => Math.min(1, Math.max(0, n));

export function startTrailLine(section) {
  const svg = section.querySelector(".trail__line");
  const paths = [...svg.children];
  const [glow, line, halo, tip] = paths;
  const about = section.querySelector("#about");
  const floor = section.querySelector(".about__floor");
  const words = [...section.querySelectorAll(".about__lead span")];
  const room = section.querySelector(".about__room");
  const file = section.querySelector(".file");
  const text = section.querySelector(".about__me > div");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let points = []; // relative to the section
  let lengths = []; // along the line, up to each point
  let roomTop = 0; // relative to the section, when the room is reached
  let frame = 0;
  let pointer = null;

  function layout() {
    const box = section.getBoundingClientRect();
    const rel = el => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
        top: r.top - box.top,
        h: r.height,
      };
    };
    const roomBox = rel(room);
    const fileTop = rel(file).top;
    roomTop = roomBox.top + roomBox.h * 0.3;

    const exit = getHeroExit();
    if (window.innerWidth >= WIDE && exit !== null) {
      points = [[exit, 0]];
      // straight down, then across the floor to arrive at (x, y)
      const go = (x, y) => {
        const [fromX, fromY] = points[points.length - 1];
        points.push([fromX, Math.max(fromY, y - Math.abs(x - fromX) * SLOPE)], [x, y]);
      };
      go(roomBox.x, roomBox.y);
      points.push([roomBox.x, fileTop]);
    } else {
      const x = Math.max(16, rel(text).x - text.offsetWidth / 2 - 30);
      points = [
        [x, 0],
        [x, fileTop + 22],
        [rel(file).x - file.offsetWidth / 2, fileTop + 22],
      ];
    }
    lengths = [0];
    for (let i = 1; i < points.length; i++) {
      const [ax, ay] = points[i - 1];
      const [bx, by] = points[i];
      lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
    }
    const d = `M${points.map(p => p.map(n => n.toFixed(1)).join(" ")).join("L")}`;
    svg.setAttribute("width", box.width);
    svg.setAttribute("height", box.height);
    paths.forEach(path => path.setAttribute("d", d));
  }

  // how much of the line is above this height
  function lengthAt(y) {
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

  function update() {
    frame = 0;
    const h = window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top;
    // starts at the bottom edge of the screen, so it carries straight on from the hero's line
    const y = h * (READING_LINE + (1 - READING_LINE) * clamp01(sectionTop / h)) - sectionTop;
    const lead = words[0].parentElement.getBoundingClientRect();
    const read = clamp01((h * 0.9 - lead.top) / (lead.height + h * 0.12));

    const total = lengths[lengths.length - 1];
    const drawn = lengthAt(y);
    [glow, line].forEach(p => (p.style.strokeDasharray = `${drawn} ${total + 1}`));
    [halo, tip].forEach(p => {
      p.style.strokeDasharray = `0.01 ${total + 10}`;
      p.style.strokeDashoffset = -drawn;
      p.style.opacity = drawn > 0 && drawn < total ? 1 : 0;
    });
    words.forEach((word, i) => word.classList.toggle("is-read", read * words.length > i));
    room.classList.toggle("is-lit", roomTop < y);
    moveFloor(); // the page moved under the cursor
  }

  const request = () => {
    if (!still && !frame) frame = requestAnimationFrame(update);
  };
  const relayout = () => {
    layout();
    request();
  };

  function moveFloor() {
    if (!pointer) return;
    const r = about.getBoundingClientRect();
    floor.style.setProperty("--mx", `${pointer.x - r.left}px`);
    floor.style.setProperty("--my", `${pointer.y - r.top}px`);
  }
  const onPointer = e => {
    pointer = { x: e.clientX, y: e.clientY };
    moveFloor();
  };
  const onLeave = () => {
    pointer = null;
    floor.style.setProperty("--mx", "-400px");
  };

  layout();
  if (still) {
    room.classList.add("is-lit");
    words.forEach(word => word.classList.add("is-read"));
  } else {
    update();
    window.addEventListener("scroll", request, { passive: true });
    if (window.matchMedia("(hover: hover)").matches) {
      about.addEventListener("pointermove", onPointer, { passive: true });
      about.addEventListener("pointerleave", onLeave);
    }
  }
  const observer = new ResizeObserver(relayout);
  observer.observe(section);
  window.addEventListener("resize", relayout);
  const offExit = onHeroExit(relayout);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", relayout);
    about.removeEventListener("pointermove", onPointer);
    about.removeEventListener("pointerleave", onLeave);
    observer.disconnect();
    offExit();
  };
}
