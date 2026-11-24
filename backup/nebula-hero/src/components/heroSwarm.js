// A small BitTorrent swarm inside the nebula.
//
// Each node is a peer downloading the same file, split into PIECES pieces. It starts with one seed.
// An idle peer asks a connected peer for a piece it lacks, rarest piece first, and the piece (a gold
// square) travels along the line between them. The gold arc around a peer is its progress; a peer
// that has everything turns gold and keeps seeding. When everyone is done, a new round starts.
//
// Moving the cursor brings the sleeping nodes around it into the swarm; they leave when it moves on.

import { nebulaGeometry } from "./heroGeometry";

const PIECES = 8;
const ALL = (1 << PIECES) - 1;
const MAX_UPLOADS = 2; // per peer, at the same time
const TICK = 110; // ms between new requests
const START_DELAY = 1900; // ms: let the name form first
const FADE_IN = 1200;
const HOLD = 2600; // ms a finished swarm is shown before the next round

const EYE = { rx: 0.12, ry: 0.17 }; // the dark centre, as fractions of the image size
const CURSOR_RADIUS = 190;
const CURSOR_LINK = 260; // how far a node woken by the cursor can reach into the swarm

const BLUE = [156, 217, 249];
const GOLD = [240, 184, 96];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const clamp01 = n => Math.min(1, Math.max(0, n));
const countBits = n => {
  let c = 0;
  for (; n; n &= n - 1) c++;
  return c;
};
const dist = (a, b) => Math.hypot(a.hx - b.hx, a.hy - b.hy);

export function startHeroSwarm({ header, canvas, image }) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  let size = { w: 0, h: 0 };
  let peers = [];
  let links = []; // { a, b }
  let transfers = []; // { from, to, piece, t, duration }
  let cursor = null;
  let finishedAt = 0;
  let lastTick = 0;
  let clock = 0; // ms the animation has actually run
  let lastTime = 0;
  let rafId = null;
  let inView = true;
  let resizeTimer = null;

  function makePeer(hx, hy, sleeper) {
    return {
      hx,
      hy,
      x: hx,
      y: hy,
      sleeper,
      join: sleeper ? 0 : 1, // 0 = not in the swarm, 1 = fully connected
      have: 0,
      progress: 0, // eased copy of have, for drawing
      flash: 0,
      downloading: false,
      uploads: 0,
      links: [],
      phase: Math.random() * Math.PI * 2,
      speed: 0.00035 + Math.random() * 0.0004,
      sway: sleeper ? 12 : 7,
    };
  }

  function connect(a, b) {
    if (a === b || a.links.some(l => l.a === b || l.b === b)) return;
    const link = { a, b };
    links.push(link);
    a.links.push(link);
    b.links.push(link);
  }

  function connectNearest(peer, pool, count, maxDistance = Infinity) {
    pool
      .filter(p => p !== peer && dist(p, peer) < maxDistance)
      .sort((p, q) => dist(p, peer) - dist(q, peer))
      .slice(0, count)
      .forEach(p => connect(peer, p));
  }

  function build() {
    const rect = header.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = { w: rect.width, h: rect.height };
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const small = size.w < 768;
    const { cx, cy, imgW, imgH } = nebulaGeometry(image, rect);
    const rx = EYE.rx * imgW;
    const ry = EYE.ry * imgH;

    peers = [];
    links = [];
    transfers = [];
    finishedAt = 0;

    // spread the peers out: of several random spots, keep the one furthest from everyone else
    const total = small ? 13 : 22;
    for (let n = 0; n < total; n++) {
      let best = null;
      let bestGap = -1;
      for (let tries = 0; tries < 14; tries++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        const spot = { hx: cx + Math.cos(a) * r * rx, hy: cy + Math.sin(a) * r * ry };
        const gap = peers.length ? Math.min(...peers.map(p => dist(p, spot))) : 1;
        if (gap > bestGap) {
          bestGap = gap;
          best = spot;
        }
      }
      peers.push(makePeer(best.hx, best.hy, false));
    }
    const core = peers.slice();
    core.forEach(p => connectNearest(p, core, 3));
    joinIslands(core);

    // sleeping nodes everywhere else, woken by the cursor (so not needed on touch screens)
    if (canHover && !reduceMotion) {
      const sleepers = [];
      const cell = Math.max(64, Math.sqrt((size.w * size.h) / 260));
      for (let x = 0; x < size.w; x += cell) {
        for (let y = 0; y < size.h; y += cell) {
          const hx = x + Math.random() * cell;
          const hy = y + Math.random() * cell;
          if (((hx - cx) / (rx * 1.15)) ** 2 + ((hy - cy) / (ry * 1.15)) ** 2 < 1) continue;
          sleepers.push(makePeer(hx, hy, true));
        }
      }
      sleepers.forEach(p => {
        connectNearest(p, sleepers, 3, cell * 2.5);
        connectNearest(p, core, 2, CURSOR_LINK);
      });
      peers.push(...sleepers);
    }

    newRound(true);
    if (reduceMotion) {
      // one still picture: a swarm part-way through a download
      core.forEach(p => {
        p.have = Math.floor(Math.random() * (ALL + 1));
        p.progress = countBits(p.have) / PIECES;
      });
    }
  }

  // Nearest-neighbour links can leave separate clusters; pieces could never cross between them
  function joinIslands(core) {
    for (;;) {
      const reached = new Set([core[0]]);
      const queue = [core[0]];
      while (queue.length) {
        const p = queue.pop();
        p.links.forEach(l => {
          const other = l.a === p ? l.b : l.a;
          if (!reached.has(other)) {
            reached.add(other);
            queue.push(other);
          }
        });
      }
      let pair = null;
      core.forEach(a => {
        if (!reached.has(a)) return;
        core.forEach(b => {
          if (reached.has(b)) return;
          if (!pair || dist(a, b) < dist(pair[0], pair[1])) pair = [a, b];
        });
      });
      if (!pair) return;
      connect(pair[0], pair[1]);
    }
  }

  function newRound(first) {
    transfers = [];
    finishedAt = 0;
    const core = peers.filter(p => !p.sleeper);
    peers.forEach(p => {
      p.have = 0;
      p.downloading = false;
      p.uploads = 0;
      if (first) p.progress = 0;
    });
    core[Math.floor(Math.random() * core.length)].have = ALL;
  }

  const active = p => p.join > 0.5;
  const other = (link, p) => (link.a === p ? link.b : link.a);

  // Start at most one transfer: a random idle peer fetches the rarest piece it can get
  function requestPiece() {
    const rarity = new Array(PIECES).fill(0);
    peers.forEach(p => {
      if (!active(p)) return;
      for (let i = 0; i < PIECES; i++) if (p.have & (1 << i)) rarity[i]++;
    });

    const waiting = peers.filter(p => active(p) && !p.downloading && p.have !== ALL);
    while (waiting.length) {
      const to = waiting.splice(Math.floor(Math.random() * waiting.length), 1)[0];
      let pick = null;
      to.links.forEach(link => {
        const from = other(link, to);
        if (!active(from) || from.uploads >= MAX_UPLOADS) return;
        for (let i = 0; i < PIECES; i++) {
          if (!(from.have & (1 << i)) || to.have & (1 << i)) continue;
          const score = rarity[i] + Math.random() * 0.9; // random between equally rare pieces
          if (!pick || score < pick.score) pick = { from, piece: i, score };
        }
      });
      if (!pick) continue;
      to.downloading = true;
      pick.from.uploads++;
      const length = Math.hypot(to.x - pick.from.x, to.y - pick.from.y);
      transfers.push({
        from: pick.from,
        to,
        piece: pick.piece,
        t: 0,
        duration: 550 + length * 4,
      });
      return;
    }
  }

  function update(dt) {
    clock += dt;

    peers.forEach(p => {
      p.x = p.hx + Math.sin(clock * p.speed + p.phase) * p.sway;
      p.y = p.hy + Math.cos(clock * p.speed * 1.3 + p.phase) * p.sway;
      p.progress += (countBits(p.have) / PIECES - p.progress) * Math.min(1, dt * 0.006);
      p.flash = Math.max(0, p.flash - dt / 500);
      if (p.sleeper) {
        const near = cursor && Math.hypot(p.x - cursor.x, p.y - cursor.y) < CURSOR_RADIUS;
        p.join += ((near ? 1 : 0) - p.join) * Math.min(1, dt * (near ? 0.007 : 0.003));
        if (!near && p.join < 0.02) {
          p.join = 0;
          p.have = 0; // left the swarm
        }
      }
    });

    transfers = transfers.filter(tr => {
      const dropped = !active(tr.from) || !active(tr.to);
      tr.t += dt / tr.duration;
      if (!dropped && tr.t < 1) return true;
      tr.from.uploads--;
      tr.to.downloading = false;
      if (!dropped) {
        tr.to.have |= 1 << tr.piece;
        tr.to.flash = 1;
      }
      return false;
    });

    if (clock < START_DELAY) return;
    if (clock - lastTick > TICK) {
      lastTick = clock;
      requestPiece();
    }
    if (!finishedAt && peers.every(p => p.sleeper || p.have === ALL)) finishedAt = clock;
    if (finishedAt && clock - finishedAt > HOLD) newRound(false);
  }

  function draw() {
    ctx.clearRect(0, 0, size.w, size.h);
    const shown = reduceMotion ? 1 : clamp01((clock - START_DELAY) / FADE_IN);
    if (shown === 0) return;

    ctx.lineWidth = 1;
    links.forEach(({ a, b }) => {
      const alpha = Math.min(a.join, b.join) * 0.2 * shown;
      if (alpha < 0.01) return;
      ctx.strokeStyle = rgba(BLUE, alpha);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // pieces on their way: a gold square with a short trail
    transfers.forEach(({ from, to, t }) => {
      const e = t * t * (3 - 2 * t);
      const tail = Math.max(0, e - 0.22);
      const x = from.x + (to.x - from.x) * e;
      const y = from.y + (to.y - from.y) * e;
      const alpha = Math.min(from.join, to.join) * shown;
      ctx.strokeStyle = rgba(GOLD, 0.45 * alpha);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(from.x + (to.x - from.x) * tail, from.y + (to.y - from.y) * tail);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = rgba(GOLD, alpha);
      ctx.fillRect(x - 2, y - 2, 4, 4);
    });

    peers.forEach(p => {
      const alpha = p.join * shown;
      if (alpha < 0.02) return;
      const done = clamp01((p.progress - 0.9) / 0.1);
      const color = mix(BLUE, GOLD, done);

      if (done > 0 || p.flash > 0) {
        ctx.fillStyle = rgba(GOLD, (0.14 * done + 0.16 * p.flash) * alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10 + p.flash * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = rgba(color, 0.9 * alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4 + done * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(BLUE, 0.22 * alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
      ctx.stroke();
      if (p.progress > 0.01) {
        ctx.strokeStyle = rgba(GOLD, 0.95 * alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p.progress);
        ctx.stroke();
      }
    });
  }

  function frame(now) {
    rafId = null;
    update(lastTime ? Math.min(50, now - lastTime) : 16);
    lastTime = now;
    draw();
    run();
  }

  // Only animate while the hero is on screen
  function run() {
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

  function onPointerMove(e) {
    if (e.pointerType === "touch") return;
    const r = header.getBoundingClientRect();
    cursor = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onPointerLeave() {
    cursor = null;
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // mobile browsers fire resize while scrolling (URL bar); the hero itself has not changed then
      const r = header.getBoundingClientRect();
      if (Math.abs(r.width - size.w) < 1 && Math.abs(r.height - size.h) < 1) return;
      build();
      run();
    }, 150);
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    run();
  });

  build();
  run();
  observer.observe(header);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", run);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    observer.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", run);
  };
}
