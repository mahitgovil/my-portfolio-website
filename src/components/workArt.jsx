// Isometric drawings for projects without a screenshot, with the tools from aboutArt.jsx.

import React from "react";
import { at, Box, floor, wall } from "./aboutArt";

const XY = (a, b, z) => at(a, b, z).split(",").map(Number);

const Ground = ({ s = 180 }) => <Box sa={s} sb={s} z={-8} h={8} className="is-floor" />;

// a link between two points, with a signal running along it
function Link({ from, to, delay = 0, color = "is-gold" }) {
  const [x1, y1] = XY(...from);
  const [x2, y2] = XY(...to);
  const d = `M${x1} ${y1}L${x2} ${y2}`;
  return (
    <>
      <path className={color} d={d} opacity=".55" />
      <path className={`iso-signal ${color}`} d={d} style={{ animationDelay: `${delay}s` }} />
    </>
  );
}

function Net() {
  const peers = [[-66, -50], [56, -66], [-60, 62], [66, 54]];
  return (
    <>
      <Ground s={196} />
      <g className="iso-ink">
        {peers.map(([a, b], i) => (
          <Link key={`${a}`} from={[a, b, 1]} to={[0, 0, 1]} delay={-i * 0.6} color={i % 2 ? "is-teal" : "is-gold"} />
        ))}
        <Link from={[-66, -50, 1]} to={[56, -66, 1]} delay={-0.4} />
        <Link from={[-60, 62, 1]} to={[66, 54, 1]} delay={-1.4} color="is-teal" />
        <Link from={[56, -66, 1]} to={[66, 54, 1]} delay={-2} />
      </g>
      {[...peers.slice(0, 2), [0, 0], ...peers.slice(2)].map(([a, b], i) => {
        const main = a === 0;
        const s = main ? 46 : 34;
        const h = main ? 62 : 30;
        return (
          <React.Fragment key={`${a} ${b}`}>
            <Box a={a} b={b} sa={s} sb={s} h={h} className={main ? "is-gold" : i % 2 ? "" : "is-cream"} />
            <g transform={wall("left", a - s / 2, b + s / 2, h)}>
              {Array.from({ length: main ? 8 : 4 }, (_, k) => (
                <rect
                  key={k}
                  className="iso-module"
                  style={{ "--i": (k * 5 + i * 2) % 8 }}
                  x={5 + (k % 2) * (s / 2 - 3)}
                  y={6 + Math.floor(k / 2) * 13}
                  width={s / 2 - 7}
                  height="8"
                />
              ))}
            </g>
          </React.Fragment>
        );
      })}
    </>
  );
}

function Terminal() {
  return (
    <>
      <Ground />
      <Box a={0} b={-34} sa={156} sb={6} z={6} h={104} className="is-gold" />
      <g className="iso-ink" transform={wall("left", -78, -31, 110)}>
        <rect x="6" y="6" width="144" height="92" opacity=".5" />
        <path d="M6 20H150" opacity=".5" />
        <path className="is-gold" d="M18 34L27 41L18 48" strokeWidth="3" />
        <path className="iso-words" pathLength="1" style={{ "--i": 0 }} d="M36 46H92" />
        <path className="iso-words is-teal" pathLength="1" style={{ "--i": 1 }} d="M18 60H116" />
        <path className="iso-words is-teal" pathLength="1" style={{ "--i": 2 }} d="M18 70H84" />
        <path className="is-gold" d="M18 80L27 87L18 94M36 94H50" strokeWidth="3" />
      </g>
      <Box a={0} b={44} sa={112} sb={36} h={4} className="is-cream" />
    </>
  );
}

const ART = { net: Net, shell: Terminal };

export function WorkArt({ art }) {
  const Art = ART[art];
  return (
    <svg className="work__art" viewBox="-185 -165 370 285" aria-hidden="true">
      <Art />
    </svg>
  );
}
