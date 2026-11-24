// The landing screen: a handful of machines share a file over BitTorrent, and the file is the name on
// the left. This runs the swarm; the view (isoView.js) decides where things are and how they look.
//
//   1. Intro: one machine has the file. Its pieces spread between the machines and fly across to
//      fill the name in, block by block.
//   2. Afterwards the machines keep trading: an idle one fetches the rarest piece it can get.
//      The eight lights on each machine are the eight pieces.
//   3. Moving over the name (or tapping it) knocks blocks out; the nearest machine that has the
//      piece sends a replacement.
//   4. Moving the cursor near the machines adds it to the swarm as "you".
//
// The name is real text. While any block is missing it is hidden and drawn on the canvas instead.

const PIECES = 8;
const ALL = (1 << PIECES) - 1;
const MAX_UPLOADS = 2;

const INTRO_START = 450; // ms before the first block leaves
const INTRO_SPREAD = 1500; // ms between the first and last block leaving
const FLIGHT = 650;
const FLASH = 380; // ms a landed block stays gold
const REFILL_DELAY = 420; // ms a knocked-out block stays away
const HOLD = 3000; // ms a finished round is shown before the next

const CREAM = "249,241,233";
const GOLD = "240,184,96";

const clamp01 = n => Math.min(1, Math.max(0, n));
const smooth = t => t * t * (3 - 2 * t);

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function startHeroMachines({ section, hero, name, canvas, onReady, view }) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  let size = { w: 0, h: 0 };
  let dpr = 1;
  let plan = null; // the view's layout for the current screen size
  let scene = null; // the box it takes up
  let machines = [];
  let links = []; // { a, b }
  let transfers = []; // between peers
  let stars = [];

  let cells = [];
  let cellSize = 16;
  let nameBox = null;
  let creamText = null; // the name, pre-drawn in both colours
  let goldText = null;
  let deliveries = []; // blocks flying to the name
  let debris = []; // blocks knocked out of it
  let reach = 0;

  const you = { you: true, x: 0, y: 0, join: 0, have: 0, uploads: 0, downloading: false, flash: 0, lit: [] };
  let youLinks = [];
  let pointer = null;
  let pointerMoved = -1e9;
  const drift = { x: 0, y: 0, tx: 0, ty: 0 };

  let clock = 0;
  let lastTick = 0;
  let finishedAt = 0;
  let intro = true;
  let ready = false;
  let lastTime = 0;
  let rafId = null;
  let inView = true;
  let disposed = false;
  let resizeTimer = null;

  // ---------- set-up ----------

  function build() {
    const heroRect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = { w: heroRect.width, h: heroRect.height };
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    buildName(heroRect);
    buildScene(heroRect);
    stars = Array.from({ length: Math.round((size.w * size.h) / 6500) }, () => ({
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      r: Math.random() < 0.15 ? 1.8 : 1.1,
      a: 0.2 + Math.random() * 0.5,
    }));
  }

  function buildScene(heroRect) {
    const hi = hero.querySelector(".hero__hi").getBoundingClientRect();
    plan = view.plan({ size, nameBox, hiTop: hi.top - heroRect.top });
    scene = plan.box;
    machines = plan.machines.map(spec => ({
      ...spec,
      x: 0,
      y: 0,
      have: 0,
      lit: new Array(PIECES).fill(0),
      flash: 0,
      uploads: 0,
      downloading: false,
      join: 1,
      links: [],
    }));
    links = plan.links.map(([a, b, ...extra]) => {
      const link = { a: machines[a], b: machines[b], extra };
      link.a.links.push(link);
      link.b.links.push(link);
      return link;
    });
    transfers = [];
    youLinks = [];
    place();
    newRound();
  }

  function buildName(heroRect) {
    const r = name.getBoundingClientRect();
    nameBox = {
      left: r.left - heroRect.left,
      top: r.top - heroRect.top,
      right: r.right - heroRect.left,
      bottom: r.bottom - heroRect.top,
    };
    const fontSize = parseFloat(getComputedStyle(name).fontSize);
    cellSize = Math.max(8, Math.min(22, Math.round(fontSize / 9)));
    reach = Math.max(30, fontSize * 0.3);

    creamText = drawName(heroRect, `rgb(${CREAM})`);
    goldText = drawName(heroRect, `rgb(${GOLD})`);

    const x0 = Math.floor(nameBox.left);
    const y0 = Math.floor(nameBox.top);
    const data = creamText
      .getContext("2d")
      .getImageData(0, 0, creamText.width, creamText.height).data;
    cells = [];
    for (let y = y0; y < nameBox.bottom; y += cellSize) {
      for (let x = x0; x < nameBox.right; x += cellSize) {
        if (hasInk(data, x, y)) {
          cells.push({
            x,
            y,
            cx: x + cellSize / 2,
            cy: y + cellSize / 2,
            piece: Math.floor(Math.random() * PIECES),
            state: "in", // in | out | coming
            flash: 0,
            outAt: 0,
            leaveAt: 0,
          });
        }
      }
    }
  }

  // Draw every character exactly where the browser laid it out
  function drawName(heroRect, color) {
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const o = off.getContext("2d", { willReadFrequently: true });
    o.setTransform(dpr, 0, 0, dpr, 0, 0);
    o.fillStyle = color;
    o.textBaseline = "alphabetic";
    name.querySelectorAll("[data-line]").forEach(line => {
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
    return off;
  }

  function hasInk(data, x, y) {
    const x1 = Math.min(creamText.width, Math.round((x + cellSize) * dpr));
    const y1 = Math.min(creamText.height, Math.round((y + cellSize) * dpr));
    for (let py = Math.max(0, Math.round(y * dpr)); py < y1; py++) {
      for (let px = Math.max(0, Math.round(x * dpr)); px < x1; px++) {
        if (data[(py * creamText.width + px) * 4 + 3] > 8) return true;
      }
    }
    return false;
  }

  function newRound() {
    transfers = [];
    finishedAt = 0;
    machines.forEach(m => {
      m.have = 0;
      m.uploads = 0;
      m.downloading = false;
    });
    you.uploads = 0;
    you.downloading = false;
    // the first round starts from the machine in the middle, later ones from anyone
    const seed = intro
      ? machines.find(m => m.seed)
      : machines[Math.floor(Math.random() * machines.length)];
    seed.have = ALL;
  }

  // ---------- the swarm ----------

  const active = p => p.join > 0.5;
  const peers = () => (you.join > 0.5 ? machines.concat(you) : machines);
  const linksOf = p => (p.you ? youLinks : p.links.concat(youLinks.filter(l => l.b === p)));

  function requestPiece() {
    const all = peers();
    const rarity = new Array(PIECES).fill(0);
    all.forEach(p => {
      for (let i = 0; i < PIECES; i++) if (p.have & (1 << i)) rarity[i]++;
    });
    const waiting = all.filter(p => !p.downloading && p.have !== ALL);
    while (waiting.length) {
      const to = waiting.splice(Math.floor(Math.random() * waiting.length), 1)[0];
      let pick = null;
      linksOf(to).forEach(link => {
        const from = link.a === to ? link.b : link.a;
        if (!active(from) || from.uploads >= MAX_UPLOADS) return;
        for (let i = 0; i < PIECES; i++) {
          if (!(from.have & (1 << i)) || to.have & (1 << i)) continue;
          const score = rarity[i] + Math.random() * 0.9;
          if (!pick || score < pick.score) pick = { from, link, piece: i, score };
        }
      });
      if (!pick) continue;
      to.downloading = true;
      pick.from.uploads++;
      const length = Math.hypot(to.x - pick.from.x, to.y - pick.from.y);
      transfers.push({
        from: pick.from,
        to,
        link: pick.link,
        piece: pick.piece,
        t: 0,
        duration: (intro ? 260 : 480) + length * (intro ? 1.2 : 2.4),
      });
      return;
    }
  }

  // The nearest machine that has this block's piece (a seed always exists)
  function sourceFor(cell) {
    const able = machines.filter(m => m.have & (1 << cell.piece));
    if (intro) return able[Math.floor(Math.random() * able.length)];
    return able.reduce((best, m) =>
      Math.hypot(m.x - cell.cx, m.y - cell.cy) < Math.hypot(best.x - cell.cx, best.y - cell.cy)
        ? m
        : best
    );
  }

  function deliver(cell) {
    const from = sourceFor(cell);
    cell.state = "coming";
    const lift = 40 + Math.random() * 90;
    deliveries.push({
      cell,
      sx: from.x,
      sy: from.y,
      mx: (from.x + cell.cx) / 2,
      my: Math.min(from.y, cell.cy) - lift,
      t: 0,
      duration: FLIGHT * (0.85 + Math.random() * 0.3),
    });
  }

  function knock(x, y, radius) {
    if (intro) return;
    cells.forEach(c => {
      if (c.state !== "in") return;
      const dx = c.cx - x;
      const dy = c.cy - y;
      const d = Math.hypot(dx, dy);
      if (d > radius) return;
      c.state = "out";
      c.outAt = clock;
      c.flash = 0;
      const force = 0.05 + Math.random() * 0.12;
      debris.push({
        cell: c,
        x: 0,
        y: 0,
        vx: (dx / (d || 1)) * force + (Math.random() - 0.5) * 0.08,
        vy: (dy / (d || 1)) * force - 0.06,
        life: 1,
      });
    });
  }

  // ---------- frame ----------

  function place() {
    view.place(machines, drift, plan);
  }

  function updateYou(dt) {
    const pad = 40;
    const inside =
      pointer &&
      pointer.x > scene.x - pad &&
      pointer.x < scene.x + scene.w + pad &&
      pointer.y > scene.y - pad &&
      pointer.y < scene.y + scene.h + pad;
    you.join += ((inside ? 1 : 0) - you.join) * Math.min(1, dt * (inside ? 0.006 : 0.008));
    you.flash = Math.max(0, you.flash - dt / 500);
    if (inside) {
      you.x = pointer.x;
      you.y = pointer.y;
      youLinks = machines
        .map(m => ({ a: you, b: m, d: Math.hypot(m.x - you.x, m.y - you.y) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
    } else if (you.join < 0.02) {
      you.join = 0;
      you.have = 0;
      youLinks = [];
    }
  }

  function update(dt) {
    clock += dt;
    const k = 1 - Math.pow(0.995, dt);
    drift.x += (drift.tx - drift.x) * k;
    drift.y += (drift.ty - drift.y) * k;
    place();
    if (canHover) updateYou(dt);

    machines.forEach(m => {
      m.flash = Math.max(0, m.flash - dt / 450);
      for (let i = 0; i < PIECES; i++) {
        const on = m.have & (1 << i) ? 1 : 0;
        m.lit[i] += (on - m.lit[i]) * Math.min(1, dt * 0.012);
      }
    });

    // pieces between machines
    transfers = transfers.filter(tr => {
      const linked = !tr.from.you && !tr.to.you ? true : you.join > 0.5;
      tr.t += dt / tr.duration;
      if (linked && tr.t < 1) return true;
      tr.from.uploads--;
      tr.to.downloading = false;
      if (linked) {
        tr.to.have |= 1 << tr.piece;
        tr.to.flash = 1;
      }
      return false;
    });
    if (clock > 250 && clock - lastTick > (intro ? 60 : view.tick)) {
      lastTick = clock;
      requestPiece();
    }
    if (!finishedAt && machines.every(m => m.have === ALL)) finishedAt = clock;
    if (finishedAt && clock - finishedAt > HOLD) newRound();

    // blocks of the name
    cells.forEach(c => {
      c.flash = Math.max(0, c.flash - dt / FLASH);
      if (c.state !== "out") return;
      if (intro) {
        if (clock >= c.leaveAt) deliver(c);
      } else if (clock - c.outAt > REFILL_DELAY) {
        const busy =
          pointer &&
          clock - pointerMoved < 350 &&
          Math.hypot(pointer.x - c.cx, pointer.y - c.cy) < reach * 1.2;
        if (!busy) deliver(c);
      }
    });
    deliveries = deliveries.filter(d => {
      d.t += dt / d.duration;
      if (d.t < 1) return true;
      d.cell.state = "in";
      d.cell.flash = 1;
      return false;
    });
    debris = debris.filter(d => {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 0.00045 * dt;
      d.life -= dt / 520;
      return d.life > 0;
    });

    if (!ready && clock > INTRO_START + 500) {
      ready = true;
      onReady();
    }
    if (intro && cells.every(c => c.state === "in")) intro = false;
  }

  function drawCell(source, c, dx, dy, alpha) {
    const sx = Math.round(c.x * dpr);
    const sy = Math.round(c.y * dpr);
    const sw = Math.round((c.x + cellSize) * dpr) - sx;
    const sh = Math.round((c.y + cellSize) * dpr) - sy;
    ctx.globalAlpha = alpha;
    ctx.drawImage(source, sx, sy, sw, sh, sx / dpr + dx, sy / dpr + dy, sw / dpr, sh / dpr);
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);
    const shown = reduceMotion ? 1 : clamp01(clock / 500);

    stars.forEach(s => {
      ctx.fillStyle = `rgba(${CREAM},${s.a * shown})`;
      ctx.fillRect(s.x, s.y, s.r, s.r);
    });

    ctx.globalAlpha = shown;
    view.drawLinks(ctx, links, plan);
    if (you.join > 0.02) view.drawYouLinks(ctx, you, youLinks, plan);
    transfers.forEach(tr => view.drawTransfer(ctx, tr, plan));
    view.drawMachines(ctx, machines, reduceMotion ? 0 : clock, plan);
    ctx.globalAlpha = 1;

    drawNameBlocks();
    if (you.join > 0.02) drawYou();
  }

  function drawNameBlocks() {
    const whole = cells.every(c => c.state === "in" && c.flash === 0);
    name.style.opacity = whole ? "1" : "0";
    if (!whole) {
      cells.forEach(c => {
        if (c.state !== "in") return;
        drawCell(creamText, c, 0, 0, 1);
        if (c.flash > 0) drawCell(goldText, c, 0, 0, c.flash);
      });
    }
    debris.forEach(d => drawCell(goldText, d.cell, d.x, d.y, clamp01(d.life)));
    ctx.globalAlpha = 1;
    deliveries.forEach(d => {
      const e = smooth(clamp01(d.t));
      const u = 1 - e;
      const x = u * u * d.sx + 2 * u * e * d.mx + e * e * d.cell.cx;
      const y = u * u * d.sy + 2 * u * e * d.my + e * e * d.cell.cy;
      const s = 5 + (cellSize * 0.75 - 5) * e;
      ctx.fillStyle = `rgba(${GOLD},${Math.min(1, d.t * 8) * 0.95})`;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    });
  }

  // the visitor's own download, under the cursor
  function drawYou() {
    const a = you.join;
    const x = you.x + 16;
    const y = you.y + 18;
    roundRect(ctx, x, y, 92, 22, 4);
    ctx.fillStyle = `rgba(11,13,20,${0.92 * a})`;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${GOLD},${(0.45 + you.flash * 0.5) * a})`;
    ctx.stroke();
    ctx.font = '500 11px "Poppins", sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${CREAM},${a})`;
    ctx.fillText("you", x + 8, y + 12);
    for (let i = 0; i < PIECES; i++) {
      const on = you.have & (1 << i);
      ctx.fillStyle = on ? `rgba(${GOLD},${a})` : `rgba(${CREAM},${0.16 * a})`;
      ctx.fillRect(x + 35 + i * 6.2, y + 8, 4.6, 6);
    }
  }

  function frame(now) {
    rafId = null;
    update(lastTime ? Math.min(50, now - lastTime) : 16);
    lastTime = now;
    draw();
    run();
  }

  function run() {
    if (disposed || !nameBox) return;
    if (reduceMotion) {
      draw();
    } else if (inView && !document.hidden) {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    } else {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      lastTime = 0;
    }
  }

  // ---------- events ----------

  function toHero(e) {
    const r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onPointerMove(e) {
    if (e.pointerType === "touch" || !nameBox || !inView) return;
    pointer = toHero(e);
    pointerMoved = clock;
    drift.tx = (0.5 - e.clientX / window.innerWidth) * 22;
    drift.ty = (0.5 - e.clientY / window.innerHeight) * 14;
    knock(pointer.x, pointer.y, reach);
  }

  function onPointerDown(e) {
    if (e.pointerType !== "touch" || !nameBox || !inView) return;
    const p = toHero(e);
    knock(p.x, p.y, reach * 1.6);
  }

  function onPointerLeave() {
    pointer = null;
    drift.tx = 0;
    drift.ty = 0;
  }

  function onScroll() {
    if (reduceMotion) return;
    const h = size.h || window.innerHeight;
    const y = Math.max(0, Math.min(window.scrollY, h));
    hero.style.transform = y ? `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)` : "";
    hero.style.opacity = y ? clamp01(1 - y / (h * 0.75)).toFixed(3) : "";
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!nameBox) return;
      // mobile browsers resize when the URL bar hides; the hero itself has not changed then
      const r = hero.getBoundingClientRect();
      if (Math.abs(r.width - size.w) < 1 && Math.abs(r.height - size.h) < 1) return;
      intro = false;
      deliveries = [];
      debris = [];
      build();
      if (reduceMotion) stillPicture();
      run();
    }, 150);
  }

  function stillPicture() {
    machines.forEach((m, i) => {
      m.have = m.seed ? ALL : (0b10110101 >> i % 4) | (1 << i % 8);
      for (let b = 0; b < PIECES; b++) m.lit[b] = m.have & (1 << b) ? 1 : 0;
    });
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    run();
  });

  // The blocks are cut from the rendered font, so wait for it (but not forever)
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
      build();
      name.style.animation = "none";
      name.style.transition = "none";
      if (reduceMotion || window.scrollY > size.h * 0.5) {
        // nothing to stage: opened further down the page, or motion is off
        intro = false;
        ready = true;
        onReady();
        if (reduceMotion) stillPicture();
      } else {
        // fill in roughly left to right
        const width = nameBox.right - nameBox.left;
        cells.forEach(c => {
          c.state = "out";
          const order = ((c.cx - nameBox.left) / width) * 0.5 + Math.random() * 0.5;
          c.leaveAt = INTRO_START + order * INTRO_SPREAD;
        });
      }
      run();
    });

  observer.observe(section);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", run);
  onScroll();

  return () => {
    disposed = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    observer.disconnect();
    name.style.opacity = "";
    name.style.animation = "";
    name.style.transition = "";
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", run);
  };
}
