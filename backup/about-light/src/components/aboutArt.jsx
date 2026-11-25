// Isometric line drawings for the About and Experience sections, in the style of the hero.
// Floor coordinates: +a runs down to the right, +b down to the left, z is up.

import React from "react";

const C30 = Math.cos(Math.PI / 6);
// draw flat on the floor, at height z
const floor = (z = 0) => `matrix(${C30} 0.5 ${-C30} 0.5 0 ${-z})`;

const at = (a, b, z = 0) =>
  `${((a - b) * C30).toFixed(2)},${((a + b) / 2 - z).toFixed(2)}`;

// centred on (a, b), sa by sb, standing on z, h tall
function Box({ a = 0, b = 0, sa, sb, z = 0, h, className = "" }) {
  const a0 = a - sa / 2;
  const a1 = a + sa / 2;
  const b0 = b - sb / 2;
  const b1 = b + sb / 2;
  const t = z + h;
  const left = [at(a0, b1, z), at(a1, b1, z), at(a1, b1, t), at(a0, b1, t)];
  const right = [at(a1, b1, z), at(a1, b0, z), at(a1, b0, t), at(a1, b1, t)];
  const top = [at(a0, b0, t), at(a1, b0, t), at(a1, b1, t), at(a0, b1, t)];
  return (
    <g className={`iso-box ${className}`}>
      <polygon className="iso-left" points={left.join(" ")} />
      <polygon className="iso-right" points={right.join(" ")} />
      <polygon className="iso-top" points={top.join(" ")} />
    </g>
  );
}

// ---------- tech stack ----------

const SLAB = { size: 116, h: 13 };

// drawn on the top of a slab, from (-58, -58) to (58, 58)
const SLAB_ART = {
  interface: (
    <>
      <rect x="-38" y="-32" width="76" height="64" rx="2" />
      <path d="M-38 -18H38" />
      <path className="is-gold" d="M-30 -25h10" />
      <rect className="is-teal" x="-30" y="-10" width="24" height="34" />
      <path d="M4 -8H30M4 2H30M4 12H20" />
    </>
  ),
  server: (
    <>
      {[-30, -6, 18].map((y, i) => (
        <g key={y}>
          <rect x="-40" y={y} width="80" height="16" />
          <path
            className={i === 1 ? "is-gold" : "is-teal"}
            d={`M-32 ${y + 8}h22`}
          />
          <path d={`M22 ${y + 8}h2M30 ${y + 8}h2`} />
        </g>
      ))}
    </>
  ),
  data: (
    <>
      <rect x="-40" y="-34" width="80" height="68" />
      <path d="M-40 -17H40M-40 0H40M-40 17H40M-14 -34V34M14 -34V34" />
      <path className="is-gold" d="M-32 8.5h10" />
      <path className="is-teal" d="M-6 25h12M22 -8h10" />
    </>
  ),
  languages: (
    <>
      <path d="M-18 -30C-34 -30 -22 0 -38 0C-22 0 -34 30 -18 30M18 -30C34 -30 22 0 38 0C22 0 34 30 18 30" />
      <path className="is-gold" d="M-10 -10H10" />
      <path className="is-teal" d="M-10 0H4" />
      <path d="M-10 10H8" />
    </>
  ),
  foundations: (
    <>
      <path d="M0 -28L-24 2M0 -28L24 2M-24 2L-38 30M-24 2L-10 30M24 2L24 30" />
      {[
        [0, -28, "is-gold"],
        [-24, 2, ""],
        [24, 2, ""],
        [-38, 30, ""],
        [-10, 30, "is-teal"],
        [24, 30, ""],
      ].map(([x, y, color]) => (
        <circle
          key={`${x} ${y}`}
          className={`iso-dot ${color}`}
          cx={x}
          cy={y}
          r="5.5"
        />
      ))}
    </>
  ),
};

export function StackSlab({ art }) {
  return (
    <svg className="stack__slab" viewBox="-106 -76 212 140" aria-hidden="true">
      <Box sa={SLAB.size} sb={SLAB.size} h={SLAB.h} />
      <g className="iso-ink" transform={floor(SLAB.h)}>
        {SLAB_ART[art]}
      </g>
    </svg>
  );
}

// ---------- experience ----------

// a chip on a circuit board
function Board() {
  return (
    <>
      <Box sa={150} sb={150} h={8} />
      <g className="iso-ink" transform={floor(8)}>
        <path className="is-teal" d="M36 -22H56V-28M36 -11H64M36 0H64M36 11H56V40H48" />
        <path className="is-gold" d="M-22 36V64M-11 36V56H-34M0 36V64M11 36V52H24V64" />
        <path d="M-36 0H-64M-36 11H-64M-22 -36V-48H-38M0 -36V-64M11 -36V-64" />
      </g>
      <Box a={-50} b={-50} sa={20} sb={20} z={8} h={30} className="is-teal" />
      <g className="iso-ink" transform={floor(8)}>
        {[-22, -11, 0, 11, 22].map(p => (
          <path key={p} d={`M${p} -38V38M-38 ${p}H38`} strokeWidth="3" />
        ))}
      </g>
      <Box a={48} b={-48} sa={14} sb={26} z={8} h={10} />
      <Box sa={64} sb={64} z={9} h={16} className="is-ink" />
      <g className="iso-ink" transform={floor(25)}>
        <rect className="is-gold" x="-18" y="-18" width="36" height="36" />
        <circle className="is-gold" cx="-25" cy="25" r="2.5" />
      </g>
      <Box a={-46} b={48} sa={26} sb={12} z={8} h={10} className="is-gold" />
    </>
  );
}

// a sound wave beside the text it became
function Speech() {
  const bars = [18, 40, 70, 34, 56, 24, 44, 14];
  return (
    <>
      <Box a={-34} sa={60} sb={170} h={8} />
      <g className="iso-ink" transform={floor(8)}>
        <path d="M-52 70V-60M-32 70V-66" />
        <path className="is-gold" d="M-42 70V-30" />
        <path className="is-teal" d="M-22 70V-8" />
      </g>
      <Box a={42} sa={26} sb={170} h={8} />
      {bars.map((h, i) => (
        <Box
          key={i}
          a={42}
          b={-70 + i * 20}
          sa={12}
          sb={10}
          z={8}
          h={h}
          className={["is-teal", "", "is-gold"][i % 3]}
        />
      ))}
    </>
  );
}

// not there yet
function Next() {
  return (
    <g transform="translate(0 42)">
      {[0, 28, 56].map(z => (
        <Box key={z} sa={110} sb={110} z={z} h={22} className="is-planned" />
      ))}
    </g>
  );
}

const STOPS = { board: Board, speech: Speech, next: Next };

// The line leaves one drawing and comes in at the same place at the top of the next one.
const JOIN = 254.9;
const ROUTE_IN = `M${JOIN} 0L160 54.8L240 101V150`;
const ROUTE_OUT = `M240 170L360 239.3L${JOIN} 300`;

function Route({ d }) {
  return (
    <g className="route">
      <path className="route__line" d={d} />
      <path className="route__tip" d={d} />
    </g>
  );
}

export function Stop({ art, first, last }) {
  const Art = STOPS[art];
  return (
    <svg className="stop__art" viewBox="0 0 480 300" aria-hidden="true">
      {!first && <Route d={ROUTE_IN} />}
      {!last && <Route d={ROUTE_OUT} />}
      <g transform="translate(240 150)">
        <Art />
      </g>
    </svg>
  );
}
