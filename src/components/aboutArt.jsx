// Isometric line drawings for the About section, in the style of the hero.
// Floor coordinates: +a runs down to the right, +b down to the left, z is up.

import React from "react";

const C30 = Math.cos(Math.PI / 6);
// draw flat on the floor, at height z
export const floor = (z = 0) => `matrix(${C30} 0.5 ${-C30} 0.5 0 ${-z})`;

export const at = (a, b, z = 0) =>
  `${((a - b) * C30).toFixed(2)},${((a + b) / 2 - z).toFixed(2)}`;

// centred on (a, b), sa by sb, standing on z, h tall: its left wall, right wall and top
function boxFaces({ a = 0, b = 0, sa, sb, z = 0, h }) {
  const a0 = a - sa / 2;
  const a1 = a + sa / 2;
  const b0 = b - sb / 2;
  const b1 = b + sb / 2;
  const t = z + h;
  return [
    [at(a0, b1, z), at(a1, b1, z), at(a1, b1, t), at(a0, b1, t)].join(" "),
    [at(a1, b1, z), at(a1, b0, z), at(a1, b0, t), at(a1, b1, t)].join(" "),
    [at(a0, b0, t), at(a1, b0, t), at(a1, b1, t), at(a0, b1, t)].join(" "),
  ];
}

export function Box({ className = "", ...box }) {
  const [left, right, top] = boxFaces(box);
  return (
    <g className={`iso-box ${className}`}>
      <polygon className="iso-left" points={left} />
      <polygon className="iso-right" points={right} />
      <polygon className="iso-top" points={top} />
    </g>
  );
}

// draw on the left or right wall of a block: (0, 0) is its top left corner
export const wall = (side, a, b, z) =>
  `matrix(${C30} ${side === "left" ? 0.5 : -0.5} 0 1 ${at(a, b, z).replace(",", " ")})`;

// ---------- about: my room, the work on the desk and everything else on the floor ----------

export function Room() {
  const [ballX, ballY] = at(72, 66, 19).split(",");
  return (
    <svg className="about__room" viewBox="-215 -185 430 335" aria-hidden="true">
      <Box sa={236} sb={236} z={-10} h={10} className="is-floor" />

      {/* badminton racket, lying down */}
      <g className="iso-ink" transform={`${floor(0)} translate(6 82) rotate(-90)`}>
        <ellipse className="is-teal" cx="0" cy="-22" rx="17" ry="23" strokeWidth="3" />
        <path d="M-10 -38V-6M0 -44V0M10 -38V-6M-15 -32H15M-17 -22H17M-15 -12H15" strokeWidth="1" opacity=".6" />
        <path d="M0 1V26" strokeWidth="2.5" />
        <path className="is-gold" d="M0 26V48" strokeWidth="6" />
      </g>

      {/* desk */}
      <Box a={-80} b={-78} sa={8} sb={54} h={50} />
      <Box a={80} b={-78} sa={8} sb={54} h={50} />
      <Box b={-78} sa={178} sb={62} z={50} h={6} />

      {/* books */}
      <Box a={-64} b={-84} sa={30} sb={24} z={56} h={6} className="is-gold" />
      <Box a={-62} b={-83} sa={30} sb={24} z={62} h={5} className="is-cream" />
      <Box a={-65} b={-85} sa={28} sb={22} z={67} h={6} />

      {/* monitor and keyboard */}
      <Box a={0} b={-92} sa={22} sb={10} z={56} h={12} />
      <Box a={0} b={-92} sa={92} sb={5} z={68} h={56} />
      <g className="iso-ink" transform={wall("left", -46, -89.5, 124)}>
        <rect x="4" y="4" width="84" height="48" opacity=".4" />
        {[
          ["is-gold", "M11 13H30"],
          ["", "M18 21H58"],
          ["is-teal", "M18 29H44"],
          ["is-gold", "M25 37H66"],
          ["", "M11 45H24"],
        ].map(([color, d], i) => (
          <path
            key={d}
            className={`iso-words ${color}`}
            style={{ "--i": i }}
            pathLength="1"
            d={d}
          />
        ))}
      </g>
      <Box a={0} b={-60} sa={62} sb={16} z={56} h={3} className="is-cream" />

      {/* computer */}
      <Box a={70} b={-82} sa={24} sb={42} z={56} h={48} className="is-gold" />
      <g transform={wall("left", 58, -61, 104)}>
        {[8, 16, 24].map((y, i) => (
          <rect key={y} className="iso-module" style={{ "--i": i }} x="5" y={y} width="14" height="4" />
        ))}
      </g>

      {/* chair */}
      <Box a={0} b={-14} sa={38} sb={38} h={3} />
      <Box a={0} b={-14} sa={6} sb={6} z={3} h={22} />
      <Box a={0} b={-14} sa={44} sb={42} z={25} h={7} className="is-cream" />
      <Box a={0} b={6} sa={44} sb={5} z={36} h={40} className="is-cream" />

      {/* dumbbell */}
      <Box a={-84} b={56} sa={9} sb={24} h={24} className="is-cream" />
      <Box a={-65} b={56} sa={30} sb={6} z={9} h={6} />
      <Box a={-46} b={56} sa={9} sb={24} h={24} className="is-cream" />

      {/* football */}
      <g className="iso-ink" transform={`translate(${ballX} ${ballY})`}>
        <circle className="iso-ball" r="19" />
        <path className="iso-patch" d="M0 -8L7.6 -2.5L4.7 6.5H-4.7L-7.6 -2.5Z" />
        <path d="M0 -8V-18M7.6 -2.5L17.5 -6M4.7 6.5L11 15M-4.7 6.5L-11 15M-7.6 -2.5L-17.5 -6" />
      </g>
    </svg>
  );
}
