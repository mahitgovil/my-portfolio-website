// The stardust behind the hero name.
//
//   1. Intro: dust leaves the nebula's ring and condenses into the letters, then the real text
//      takes over.
//   2. Afterwards: wherever the cursor (or a tap) touches the name, that patch of text is masked
//      out and shown as dust instead, pushed away from the pointer. It settles back on leaving.
//   3. The nebula drifts slightly with the cursor.
//
// The name is always real text. The canvas only draws while something is moving.

import { nebulaGeometry } from "./heroGeometry";

const CREAM = [249, 241, 233];
const GOLD = [226, 158, 74];
const SHADES = 10;
const PALETTE = Array.from({ length: SHADES + 1 }, (_, i) => {
  const t = i / SHADES;
  const c = GOLD.map((g, k) => Math.round(g + (CREAM[k] - g) * t));
  return `rgb(${c.join(",")})`;
});

const INTRO_TRAVEL = 1150; // ms one grain is in the air
const INTRO_STAGGER = 600; // ms between the first and last grain leaving
const INTRO_FADE = 450; // ms for the dust to give way to the text

// The ring's size, as fractions of the hero image
const RING = { rx: 0.19, ry: 0.27 };

const clamp01 = n => Math.min(1, Math.max(0, n));
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startHeroDust({ section, hero, name, canvas, image, onReady }) {
  const ctx = canvas.getContext("2d");
  let grains = [];
  let size = { w: 0, h: 0 };
  let grainSize = 1.5;
  let reach = 0; // radius of the pointer's effect on the name
  let nameBox = null; // name rect, relative to the hero

  let phase = "waiting"; // waiting -> intro -> idle
  let introStart = 0;
  let rafId = null;
  let lastTime = 0;
  let inView = true;
  let disposed = false;
  let resizeTimer = null;
  let tapTimer = null;

  const pointer = { x: 0, y: 0, r: 0, targetR: 0 };
  const drift = { x: 0, y: 0, tx: 0, ty: 0 };

  function measure() {
    const heroRect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = { w: heroRect.width, h: heroRect.height };
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const r = name.getBoundingClientRect();
    nameBox = {
      left: r.left - heroRect.left,
      top: r.top - heroRect.top,
      right: r.right - heroRect.left,
      bottom: r.bottom - heroRect.top,
    };

    const fontSize = parseFloat(getComputedStyle(name).fontSize);
    reach = Math.max(56, fontSize * 0.62);
    grains = sampleText(heroRect, fontSize);
  }

  // Draw every character exactly where the browser laid it out, then keep one grain per few pixels
  function sampleText(heroRect, fontSize) {
    const off = document.createElement("canvas");
    off.width = Math.ceil(size.w);
    off.height = Math.ceil(size.h);
    const o = off.getContext("2d", { willReadFrequently: true });
    o.fillStyle = "#fff";
    o.textBaseline = "alphabetic";

    name.querySelectorAll("[data-dust]").forEach(line => {
      const cs = getComputedStyle(line);
      o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const ascent = o.measureText("M").fontBoundingBoxAscent;
      const node = line.firstChild;
      const range = document.createRange();
      for (let i = 0; i < node.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        o.fillText(node.data[i], rect.left - heroRect.left, rect.top - heroRect.top + ascent);
      }
    });

    const step = fontSize > 110 ? 3 : 2;
    const max = size.w < 768 ? 2400 : 4800;
    grainSize = step === 3 ? 1.9 : 1.4;

    const x0 = Math.max(0, Math.floor(nameBox.left));
    const y0 = Math.max(0, Math.floor(nameBox.top));
    const w = Math.max(1, Math.min(off.width, Math.ceil(nameBox.right)) - x0);
    const h = Math.max(1, Math.min(off.height, Math.ceil(nameBox.bottom)) - y0);
    const { data } = o.getImageData(x0, y0, w, h);

    const points = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 110) points.push([x0 + x, y0 + y]);
      }
    }
    const keep = Math.min(1, max / Math.max(1, points.length));

    const { cx, cy, imgW, imgH } = nebulaGeometry(image, heroRect);

    const out = [];
    for (const [hx, hy] of points) {
      if (Math.random() > keep) continue;
      const a = Math.random() * Math.PI * 2;
      const spread = 0.85 + Math.random() * 0.35;
      const sx = cx + Math.cos(a) * RING.rx * imgW * spread;
      const sy = cy + Math.sin(a) * RING.ry * imgH * spread;
      // control point: leave along the ring before turning towards the letter
      const swirl = 0.45 + Math.random() * 0.5;
      out.push({
        hx,
        hy,
        sx,
        sy,
        mx: sx - Math.sin(a) * RING.rx * imgW * swirl,
        my: sy + Math.cos(a) * RING.ry * imgH * swirl,
        x: hx,
        y: hy,
        vx: 0,
        vy: 0,
        delay: ((hx - x0) / w) * 0.55 + Math.random() * 0.45, // the name fills in left to right
        angle: Math.random() * Math.PI * 2,
        jitter: 0.15 + Math.random() * 0.95,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random()),
        shade: Math.random(),
      });
    }
    return out;
  }

  function drawIntro(now) {
    const t = now - introStart;
    const settled = INTRO_TRAVEL + INTRO_STAGGER;
    const fade = 1 - clamp01((t - settled) / INTRO_FADE);
    for (const g of grains) {
      const p = clamp01((t - g.delay * INTRO_STAGGER) / INTRO_TRAVEL);
      if (p <= 0) continue;
      const e = easeInOut(p);
      const u = 1 - e;
      const x = u * u * g.sx + 2 * u * e * g.mx + e * e * g.hx;
      const y = u * u * g.sy + 2 * u * e * g.my + e * e * g.hy;
      ctx.globalAlpha = Math.min(1, p * 5) * fade * 0.95;
      ctx.fillStyle = PALETTE[Math.round(e * e * SHADES)];
      ctx.fillRect(x, y, grainSize, grainSize);
    }
    ctx.globalAlpha = 1;
    if (t > settled - 120) onReady();
    if (fade <= 0) phase = "idle";
  }

  // Returns true while any grain is still away from its letter
  function drawScatter(now, dt) {
    const { x: px, y: py, r } = pointer;
    let moving = false;
    const damping = Math.pow(0.8, dt);
    for (const g of grains) {
      let tx = g.hx;
      let ty = g.hy;
      const dx = g.hx - px;
      const dy = g.hy - py;
      const d = Math.hypot(dx, dy);
      const hit = r > 1 && d < r;
      if (hit) {
        // a loose cloud that keeps drifting: wide at the centre, closing back into the letter
        // at the rim so dust and text meet without a seam
        const k = Math.min(1, (1 - d / r) * 1.7);
        const push = k * r * 0.34 * g.jitter;
        const a = g.angle + now * 0.0007 * g.spin;
        tx += Math.cos(a) * push + (dx / (d || 1)) * k * r * 0.1;
        ty += Math.sin(a) * push + (dy / (d || 1)) * k * r * 0.1;
      }
      g.vx = (g.vx + (tx - g.x) * 0.09 * dt) * damping;
      g.vy = (g.vy + (ty - g.y) * 0.09 * dt) * damping;
      g.x += g.vx * dt;
      g.y += g.vy * dt;

      const away = Math.hypot(g.x - g.hx, g.y - g.hy);
      if (away < 0.4 && !hit) {
        g.x = g.hx;
        g.y = g.hy;
        g.vx = 0;
        g.vy = 0;
        continue;
      }
      moving = true;
      const near = clamp01(1 - away / (reach * 0.6));
      ctx.globalAlpha = hit ? 1 : clamp01(away / 6);
      ctx.fillStyle = PALETTE[Math.round(near * SHADES * (0.5 + g.shade * 0.5))];
      ctx.fillRect(g.x, g.y, grainSize, grainSize);
    }
    ctx.globalAlpha = 1;
    return moving;
  }

  function applyMask() {
    let mask = "none";
    if (pointer.r > 1) {
      const x = (pointer.x - nameBox.left).toFixed(1);
      const y = (pointer.y - nameBox.top).toFixed(1);
      const r = pointer.r.toFixed(1);
      mask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 78%, #000 96%)`;
    }
    name.style.webkitMaskImage = mask;
    name.style.maskImage = mask;
  }

  function frame(now) {
    rafId = null;
    const dt = Math.min(3, lastTime ? (now - lastTime) / 16.67 : 1); // in 60fps frames
    lastTime = now;
    ctx.clearRect(0, 0, size.w, size.h);

    let active = false;
    if (phase === "intro") {
      if (!introStart) introStart = now;
      drawIntro(now);
      active = true;
    } else if (phase === "idle") {
      pointer.r += (pointer.targetR - pointer.r) * (1 - Math.pow(0.86, dt));
      if (pointer.targetR === 0 && pointer.r < 1) pointer.r = 0;
      applyMask();
      const moving = drawScatter(now, dt);
      active = moving || pointer.r > 0 || pointer.targetR > 0;
    }

    const k = 1 - Math.pow(0.93, dt);
    drift.x += (drift.tx - drift.x) * k;
    drift.y += (drift.ty - drift.y) * k;
    section.style.setProperty("--drift-x", `${drift.x.toFixed(2)}px`);
    section.style.setProperty("--drift-y", `${drift.y.toFixed(2)}px`);
    if (Math.hypot(drift.tx - drift.x, drift.ty - drift.y) > 0.1) active = true;

    if (active) wake();
    else lastTime = 0;
  }

  function wake() {
    if (rafId === null && inView && !disposed) rafId = requestAnimationFrame(frame);
  }

  // Moves the pointer and reports whether it is over the name
  function setPointer(clientX, clientY) {
    const r = hero.getBoundingClientRect();
    pointer.x = clientX - r.left;
    pointer.y = clientY - r.top;
    const pad = reach * 0.4;
    return (
      pointer.x > nameBox.left - pad &&
      pointer.x < nameBox.right + pad &&
      pointer.y > nameBox.top - pad &&
      pointer.y < nameBox.bottom + pad
    );
  }

  function onPointerMove(e) {
    if (e.pointerType === "touch" || !nameBox || !inView) return;
    const over = setPointer(e.clientX, e.clientY);
    pointer.targetR = over ? reach : 0;
    drift.tx = (0.5 - e.clientX / window.innerWidth) * 28;
    drift.ty = (0.5 - e.clientY / window.innerHeight) * 18;
    wake();
  }

  // Touch has no hover: a tap scatters the letters for a moment instead
  function onPointerDown(e) {
    if (e.pointerType !== "touch" || !nameBox || !inView) return;
    if (!setPointer(e.clientX, e.clientY)) return;
    pointer.targetR = reach * 1.5;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
      pointer.targetR = 0;
      wake();
    }, 650);
    wake();
  }

  function onPointerLeave() {
    pointer.targetR = 0;
    drift.tx = 0;
    drift.ty = 0;
    wake();
  }

  // Scrolling away: the text sinks back and fades instead of sliding off like a sticker
  function onScroll() {
    const h = size.h || window.innerHeight;
    const y = Math.max(0, Math.min(window.scrollY, h));
    hero.style.transform = y ? `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)` : "";
    hero.style.opacity = y ? clamp01(1 - y / (h * 0.75)).toFixed(3) : "";
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!nameBox) return; // not started yet
      // mobile browsers resize when the URL bar hides; the hero itself has not changed then
      const r = hero.getBoundingClientRect();
      if (Math.abs(r.width - size.w) < 1 && Math.abs(r.height - size.h) < 1) return;
      phase = "idle";
      onReady();
      pointer.r = 0;
      pointer.targetR = 0;
      measure();
      applyMask();
      onScroll();
      wake();
    }, 150);
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      wake();
    } else if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastTime = 0;
    }
  });

  // The letters are sampled from the rendered font, so wait for it (but not forever)
  const fonts = document.fonts
    ? Promise.all([
        document.fonts.load("700 1em Poppins"),
        document.fonts.load("300 1em Poppins"),
      ])
    : Promise.resolve();
  Promise.race([fonts, new Promise(resolve => setTimeout(resolve, 1500))])
    .catch(() => {})
    .then(() => {
      if (disposed) return;
      measure();
      // opened further down the page (#contact, or a reload): no point staging an intro
      phase = window.scrollY < size.h * 0.5 ? "intro" : "idle";
      if (phase === "idle") onReady();
      wake();
    });

  observer.observe(section);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  onScroll();

  return () => {
    disposed = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    clearTimeout(tapTimer);
    observer.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
}
