// How the landing screen draws the swarm: an isometric line drawing of servers, terminals and storage, joined
// by routes that run along the floor. heroMachines.js runs the swarm itself.
//
// Floor coordinates: +x runs down to the right, +y down to the left, z is up. The large server in the
// middle stands on (0, 0). Each thing shows the eight pieces of the file it has as lit marks.

import { setHeroExit } from "./heroExit";
import { getPalette } from "./theme";

// set from the theme's palette before every frame
let COLORS = getPalette();
let FACE = COLORS.faces.teal; // of the machine being drawn

const C30 = Math.cos(Math.PI / 6);
const PIECES = 8;
const smooth = t => t * t * (3 - 2 * t);

// [kind, floor x, floor y, colour, options]
const FULL = {
  bounds: { left: -224, right: 222, top: -246, bottom: 198 },
  nodes: [
    ["core", 0, 0, "teal", { seed: true }],
    ["stack", -164, -157, "gold"],
    ["twin", -47, -211, "gold"],
    ["panelY", -237, -83, "teal", { w: 89, h: 64, show: "code" }],
    ["panelY", -201, 13, "teal", { w: 78, h: 58, show: "prompt" }],
    ["panelX", -60, 96, "gold", { w: 69, h: 46, show: "prompt" }],
    ["panelX", 85, -77, "teal", { w: 69, h: 60, show: "search" }],
    ["cluster", 0, 183, "cream"],
    ["db", 165, -65, "cream"],
    ["disc", 165, 19, "teal"],
    ["disc", 211, 45, "gold"],
    ["disc", 232, 10, "gold"],
    ["disc", 101, 179, "cream"],
  ],
  // [from, to, colour, the way there, draw a second line beside it]
  links: [
    [1, 0, "gold", [[-164, -157], [-164, -64], [-20, -64], [-20, 0]], true],
    [3, 0, "teal", [[-237, -46], [-46, -46], [-46, -10], [0, -10]]],
    [4, 0, "teal", [[-201, 30], [-95, 30], [-95, 8], [0, 8]]],
    [2, 0, "cream", [[-24, -211], [-24, 0]], true],
    [2, 1, "gold", [[-79, -205], [-79, -157], [-164, -157]]],
    [6, 0, "teal", [[85, -90], [85, -22], [0, -22]], true],
    [5, 0, "gold", [[-40, 88], [-40, 52], [-8, 52], [-8, 0]]],
    [7, 0, "teal", [[24, 183], [24, 118], [4, 118], [4, 0]], true],
    [5, 7, "gold", [[-70, 96], [-70, 150], [-36, 150], [-36, 184]]],
    [0, 9, "teal", [[0, 4], [112, 4], [112, 19], [165, 19]], true],
    [12, 0, "gold", [[101, 179], [101, 86], [16, 86], [16, 0]], true],
    [9, 6, "gold", [[156, 19], [156, -46], [98, -46], [98, -84]]],
    [9, 8, "cream", [[165, 19], [165, -65]]],
    [9, 10, "gold", [[165, 24], [211, 24], [211, 45]]],
    [9, 11, "teal", [[165, 12], [232, 12]]],
    [12, 10, "cream", [[101, 179], [211, 179], [211, 45]]],
    [7, 12, "teal", [[36, 183], [101, 183]]],
  ],
};

// very little height: three things in a row
const MINI = {
  bounds: { left: -180, right: 180, top: -102, bottom: 42 },
  nodes: [
    ["core", 0, 0, "teal", { seed: true }],
    ["panelX", -76, 78, "gold", { w: 78, h: 56, show: "prompt" }],
    ["stack", 76, -74, "gold"],
  ],
  links: [
    [1, 0, "gold", [[-76, 66], [-76, 30], [-10, 30], [-10, 0]], true],
    [2, 0, "teal", [[76, -74], [76, -6], [0, -6]], true],
  ],
};

const HEIGHT = { core: 48, stack: 40, twin: 40, cluster: 34, panelX: 30, panelY: 34, db: 24, disc: 6 };

// ---------- projection ----------

function project(plan, gx, gy, z = 0) {
  return [
    plan.ox + (gx - gy) * C30 * plan.unit,
    plan.oy + ((gx + gy) * 0.5 - z) * plan.unit,
  ];
}

function unproject(plan, p) {
  const sx = (p.x - plan.ox) / plan.unit / C30;
  const sy = ((p.y - plan.oy) / plan.unit) * 2;
  return [(sy + sx) / 2, (sy - sx) / 2];
}

function polygon(ctx, plan, points) {
  ctx.beginPath();
  points.forEach(([x, y, z], i) => {
    const [px, py] = project(plan, x, y, z);
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  });
  ctx.closePath();
}

// Draw on a wall as if it were flat paper: (0, 0) is its top left corner, u runs right, v down
function onFace(ctx, plan, corner, slope, paint) {
  const [x, y] = project(plan, ...corner);
  ctx.save();
  ctx.transform(C30 * plan.unit, slope * 0.5 * plan.unit, 0, plan.unit, x, y);
  paint();
  ctx.restore();
}

// ---------- shapes ----------

function box(ctx, plan, cx, cy, sx, sy, z, h, stroke) {
  const x0 = cx - sx / 2;
  const x1 = cx + sx / 2;
  const y0 = cy - sy / 2;
  const y1 = cy + sy / 2;
  const t = z + h;
  const sides = [
    [FACE.left, [[x0, y1, z], [x1, y1, z], [x1, y1, t], [x0, y1, t]]],
    [FACE.right, [[x1, y1, z], [x1, y0, z], [x1, y0, t], [x1, y1, t]]],
    [FACE.top, [[x0, y0, t], [x1, y0, t], [x1, y1, t], [x0, y1, t]]],
  ];
  sides.forEach(([fill, points]) => {
    polygon(ctx, plan, points);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) ctx.stroke();
  });
}

function outline(ctx, plan, m) {
  const bright = Math.min(1, 0.9 + m.flash * 0.1);
  ctx.strokeStyle = `rgba(${m.flash > 0.3 ? COLORS.lit : COLORS[m.color]},${bright})`;
  ctx.lineWidth = Math.max(1.1, 1.05 * plan.unit) + m.flash * 0.5;
  ctx.lineJoin = "round";
}

function mark(ctx, m, piece, x, y, w, h) {
  ctx.fillStyle = `rgba(${COLORS[m.color]},0.2)`;
  ctx.fillRect(x, y, w, h);
  if (m.lit[piece] > 0.01) {
    ctx.fillStyle = `rgba(${COLORS.lit},${m.lit[piece]})`;
    ctx.fillRect(x, y, w, h);
  }
}

// A stack of units. Marks run along the left wall, status lights along the right one.
function server(ctx, plan, m, time, { cx, cy, s, units, uh, gap, first, total, per }) {
  const height = units * uh + (units - 1) * gap;
  box(ctx, plan, cx, cy, s * 0.9, s * 0.9, 0, height - 1, false);
  for (let u = 0; u < units; u++) {
    const z = u * (uh + gap);
    outline(ctx, plan, m);
    box(ctx, plan, cx, cy, s, s, z, uh, true);
    onFace(ctx, plan, [cx - s / 2, cy + s / 2, z + uh], 1, () => {
      ctx.strokeStyle = `rgba(${COLORS[m.color]},0.3)`;
      ctx.lineWidth = 0.7;
      ctx.strokeRect(s * 0.09, uh * 0.24, s * 0.82, uh * 0.52);
      const w = (s * 0.7 - (per - 1) * 2) / per;
      for (let k = 0; k < per; k++) {
        const slot = first + (units - 1 - u) * per + k;
        mark(ctx, m, Math.floor((slot * PIECES) / total), s * 0.15 + k * (w + 2), uh * 0.4, w, uh * 0.2);
      }
    });
    onFace(ctx, plan, [cx + s / 2, cy + s / 2, z + uh], -1, () => {
      ctx.fillStyle = `rgba(${COLORS[m.color]},0.28)`;
      ctx.fillRect(s * 0.14, uh * 0.46, s * 0.36, uh * 0.1);
      const r = Math.max(0.9, uh * 0.085);
      for (let k = 0; k < 3; k++) {
        const on = (time / 420 + u * 1.7 + k * 2.3 + first) % 3 < 1.6;
        ctx.fillStyle = `rgba(${k === 1 ? COLORS.lit : COLORS[m.color]},${on ? 0.95 : 0.3})`;
        ctx.beginPath();
        ctx.arc(s * 0.64 + k * s * 0.11, uh * 0.52, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

const CODE = [
  [0, 22, "teal"], [0, 10, "gold"], [8, 34, "cream"], [8, 20, "gold"], [16, 24, "teal"], [8, 14, "cream"], [0, 8, "teal"],
];

function windowFace(ctx, m, time, w, h) {
  const line = (x, y, len, color, alpha = 0.75) => {
    ctx.fillStyle = `rgba(${COLORS[color]},${alpha})`;
    ctx.fillRect(x, y, len, 1.5);
  };
  // frame and title bar
  ctx.strokeStyle = `rgba(${COLORS[m.color]},0.4)`;
  ctx.lineWidth = 0.7;
  ctx.strokeRect(3, 3, w - 6, h - 6);
  ctx.beginPath();
  ctx.moveTo(3, 11);
  ctx.lineTo(w - 3, 11);
  ctx.stroke();
  ["gold", "teal", "cream"].forEach((c, i) => {
    ctx.fillStyle = `rgba(${COLORS[c]},0.9)`;
    ctx.beginPath();
    ctx.arc(8 + i * 5, 7, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });

  const k = w / 78;
  if (m.show === "code") {
    CODE.slice(0, Math.floor((h - 26) / 5)).forEach(([x, len, c], i) => {
      line(9 + x * k, 17 + i * 5, len * k, c);
      if (i % 3 === 0) line(9 + (x + len + 4) * k, 17 + i * 5, 11 * k, "cream", 0.35);
    });
  } else if (m.show === "search") {
    ctx.strokeStyle = `rgba(${COLORS.gold},0.9)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(9, 16, w - 18, 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(14, 20.2, 2, 0, Math.PI * 2);
    ctx.moveTo(15.5, 21.8);
    ctx.lineTo(17.2, 23.4);
    ctx.stroke();
    line(21, 19.8, 20, "cream", 0.6);
    [[30, "gold"], [22, "teal"], [26, "cream"], [16, "teal"]].forEach(([len, c], i) =>
      line(9, 30 + i * 4.6, len, c, 0.7)
    );
  } else {
    ctx.fillStyle = `rgba(${COLORS.lit},1)`;
    ctx.font = "600 13px ui-monospace, Consolas, monospace";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("$", 10, 27);
    if (time % 1100 < 620) ctx.fillRect(20, 25.5, 8, 1.8);
  }

  const seg = (w - 18 - 7 * 2) / PIECES;
  for (let i = 0; i < PIECES; i++) mark(ctx, m, i, 9 + i * (seg + 2), h - 9.5, seg, 3);
}

function cylinder(ctx, plan, cx, cy, r, z, h) {
  const [x, y] = project(plan, cx, cy, z);
  const rx = r * plan.unit;
  const ry = rx * 0.57;
  const top = y - h * plan.unit;
  ctx.beginPath();
  ctx.moveTo(x - rx, top);
  ctx.lineTo(x - rx, y);
  ctx.ellipse(x, y, rx, ry, 0, Math.PI, 0, true);
  ctx.lineTo(x + rx, top);
  ctx.closePath();
  ctx.fillStyle = FACE.left;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x, top, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = FACE.top;
  ctx.fill();
  ctx.stroke();
  return { x, y: top, rx, ry };
}

// eight marks round the top of a disc or a drum
function ring(ctx, plan, m, { x, y, rx, ry }) {
  ctx.lineWidth = Math.max(1.2, 1.7 * plan.unit);
  for (let i = 0; i < PIECES; i++) {
    const a = -Math.PI / 2 + (i / PIECES) * Math.PI * 2;
    const arc = alpha => {
      ctx.strokeStyle = alpha;
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 0.6, ry * 0.6, 0, a + 0.12, a + Math.PI / 4 - 0.12);
      ctx.stroke();
    };
    arc(`rgba(${COLORS[m.color]},0.2)`);
    if (m.lit[i] > 0.01) arc(`rgba(${COLORS.lit},${m.lit[i]})`);
  }
}

const DRAW = {
  core(ctx, plan, m, time) {
    server(ctx, plan, m, time, { cx: m.gx, cy: m.gy, s: 47, units: 4, uh: 17, gap: 2.6, first: 0, total: 8, per: 2 });
  },
  stack(ctx, plan, m, time) {
    server(ctx, plan, m, time, { cx: m.gx, cy: m.gy, s: 41, units: 3, uh: 18, gap: 3, first: 0, total: 9, per: 3 });
  },
  twin(ctx, plan, m, time) {
    [-32, 33].forEach((dx, i) =>
      server(ctx, plan, m, time, { cx: m.gx + dx, cy: m.gy, s: 41, units: 3, uh: 18, gap: 3, first: i * 6, total: 12, per: 2 })
    );
  },
  cluster(ctx, plan, m, time) {
    [-37, 0, 36].forEach((dx, i) =>
      server(ctx, plan, m, time, { cx: m.gx + dx, cy: m.gy, s: 27, units: 4, uh: 11.5, gap: 2.2, first: i * 4, total: 12, per: 1 })
    );
  },
  panelY(ctx, plan, m, time) {
    outline(ctx, plan, m);
    box(ctx, plan, m.gx, m.gy, 5, m.w, 4, m.h, true);
    onFace(ctx, plan, [m.gx + 2.5, m.gy + m.w / 2, 4 + m.h], -1, () => windowFace(ctx, m, time, m.w, m.h));
  },
  panelX(ctx, plan, m, time) {
    outline(ctx, plan, m);
    box(ctx, plan, m.gx, m.gy, m.w, 5, 4, m.h, true);
    onFace(ctx, plan, [m.gx - m.w / 2, m.gy + 2.5, 4 + m.h], 1, () => windowFace(ctx, m, time, m.w, m.h));
  },
  db(ctx, plan, m) {
    let top;
    for (let i = 0; i < 3; i++) {
      outline(ctx, plan, m);
      top = cylinder(ctx, plan, m.gx, m.gy, 18.5, i * 15, 12);
    }
    ring(ctx, plan, m, top);
  },
  disc(ctx, plan, m) {
    outline(ctx, plan, m);
    ring(ctx, plan, m, cylinder(ctx, plan, m.gx, m.gy, 13, 0, 7));
  },
};

// ---------- routes ----------

function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

function pointAt(points, distance) {
  let left = distance;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const len = Math.hypot(bx - ax, by - ay);
    if (left <= len || i === points.length - 1) {
      const t = len ? Math.min(1, left / len) : 0;
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
    left -= len;
  }
  return points[0];
}

function strokeRoute(ctx, plan, points, shift = 0) {
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    const [px, py] = project(plan, x + shift, y + shift);
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  });
  ctx.stroke();
}

// from the visitor's cursor: along one axis, then the other
function routeToYou(plan, you, machine) {
  const [x, y] = unproject(plan, you);
  return [[x, y], [machine.gx, y], [machine.gx, machine.gy]];
}

function drawExit(ctx, plan) {
  const { x, bottom } = plan.exit;
  const [cx, cy] = project(plan, 211, 179);
  const points = [[cx, cy], [x, cy + Math.abs(cx - x) / C30 / 2], [x, bottom]];
  const width = ctx.lineWidth;
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgb(${COLORS.line})`;
  ctx.beginPath();
  points.forEach(p => ctx.lineTo(...p));
  ctx.stroke();
  // the same soft glow as the line in About, so the two meet
  ctx.lineWidth = 6;
  ctx.strokeStyle = `rgba(${COLORS.line},0.2)`;
  ctx.stroke();
  ctx.lineWidth = width;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const head = (performance.now() / 9) % 500;
  ctx.fillStyle = `rgb(${COLORS.lit})`;
  for (let i = 0; i < 4; i++) {
    const along = head - i * 12;
    if (along < 0 || along > pathLength(points)) continue;
    const [px, py] = pointAt(points, along);
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------- the view ----------

export const isoView = {
  tick: 85, // ms between requests

  plan({ size, nameBox, hiTop }) {
    let box;
    let world = FULL;
    const screen = window.innerWidth; // what the media queries measure
    if (screen <= 768) {
      box = { x: size.w * 0.04, y: 64, w: size.w * 0.92, h: Math.max(70, hiTop - 12 - 64) };
      if (box.h < 200) world = MINI;
    } else {
      const x = Math.max(size.w * 0.505, nameBox.right + 24);
      const y = Math.max(66, size.h * 0.12);
      const right = Math.min(size.w * 0.97, x + 1000);
      box = { x, y, w: right - x, h: size.h * 0.9 - y };
    }
    const { left, right, top, bottom } = world.bounds;
    const unit = Math.min(2, box.w / (right - left), box.h / (bottom - top));
    const plan = {
      box,
      unit,
      homeX: box.x + box.w / 2 - ((left + right) / 2) * unit,
      homeY: box.y + box.h / 2 - ((top + bottom) / 2) * unit,
      ox: 0,
      oy: 0,
      machines: world.nodes.map(([kind, gx, gy, color, options = {}]) => ({ kind, gx, gy, color, ...options })),
      links: world.links,
      exit: null,
    };
    // the lowest corner of the scene sends a line off the bottom of the screen, on into About
    if (screen >= 992) {
      const x = plan.homeX + (211 - 179) * C30 * unit;
      const y = plan.homeY + ((211 + 179) / 2) * unit;
      const across = Math.min(120, (size.h - y) * 1.2);
      plan.exit = { x: x - across, bottom: size.h };
    }
    setHeroExit(plan.exit && plan.exit.x);
    return plan;
  },

  place(machines, drift, plan) {
    plan.ox = plan.homeX + drift.x * 0.6;
    plan.oy = plan.homeY + drift.y * 0.6;
    machines.forEach(m => {
      [m.x, m.y] = project(plan, m.gx, m.gy, HEIGHT[m.kind]);
    });
  },

  drawLinks(ctx, links, plan) {
    COLORS = getPalette();
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(0.9, 0.85 * plan.unit);
    links.forEach(({ extra: [color, points, double] }) => {
      ctx.strokeStyle = `rgba(${COLORS[color]},0.85)`;
      strokeRoute(ctx, plan, points);
      if (double) {
        ctx.strokeStyle = `rgba(${COLORS[color === "gold" ? "teal" : "gold"]},0.55)`;
        strokeRoute(ctx, plan, points, 7);
      }
    });
    if (plan.exit) drawExit(ctx, plan);
  },

  drawYouLinks(ctx, you, youLinks, plan) {
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = Math.max(0.9, 0.85 * plan.unit);
    ctx.strokeStyle = `rgba(${COLORS.lit},${0.6 * you.join})`;
    youLinks.forEach(({ b }) => strokeRoute(ctx, plan, routeToYou(plan, you, b)));
    ctx.setLineDash([]);
  },

  // four dots in a line, the first one brightest
  drawTransfer(ctx, { from, to, t, link, piece }, plan) {
    let points;
    if (from.you || to.you) points = routeToYou(plan, from.you ? from : to, from.you ? to : from);
    else points = link.extra[1];
    const forward = from.you || (!to.you && link.a === from);
    const total = pathLength(points);
    const head = smooth(t) * total;
    const alpha = Math.min(from.join, to.join);
    const color = piece % 3 === 0 ? COLORS.teal : COLORS.lit;
    for (let i = 3; i >= 0; i--) {
      const along = head - i * 8.5;
      if (along < 0) continue;
      const [gx, gy] = pointAt(points, forward ? along : total - along);
      const [x, y] = project(plan, gx, gy, 1.5);
      ctx.fillStyle = `rgba(${i ? color : COLORS.head},${[1, 0.8, 0.5, 0.28][i] * alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.6, 2 * plan.unit) * (1 - i * 0.1), 0, Math.PI * 2);
      ctx.fill();
    }
  },

  drawMachines(ctx, machines, time, plan) {
    machines
      .slice()
      .sort((a, b) => a.gx + a.gy - (b.gx + b.gy)) // back to front
      .forEach(m => {
        FACE = COLORS.faces[m.color];
        DRAW[m.kind](ctx, plan, m, time);
      });
  },
};
