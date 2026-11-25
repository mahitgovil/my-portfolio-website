// Isometric drawings for "What I do", with the tools from aboutArt.jsx.

import React from "react";
import { at, Box, floor, wall } from "./aboutArt";

const XY = (a, b, z) => at(a, b, z).split(",").map(Number);

const Ground = ({ s = 180 }) => <Box sa={s} sb={s} z={-8} h={8} />;

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

function Web() {
  return (
    <>
      <Ground />
      <Box a={0} b={-34} sa={150} sb={6} z={6} h={100} />
      <g className="iso-ink" transform={wall("left", -75, -31, 106)}>
        <rect x="6" y="6" width="138" height="88" opacity=".5" />
        <path d="M6 20H144" opacity=".5" />
        <path className="is-gold" d="M14 13h.1" strokeWidth="5" />
        <path className="is-teal" d="M24 13h.1" strokeWidth="5" />
        <path d="M34 13h.1" strokeWidth="5" />
        <rect className="is-teal" x="16" y="30" width="46" height="52" />
        <path className="iso-words" pathLength="1" style={{ "--i": 0 }} d="M74 36H132" />
        <path className="iso-words is-teal" pathLength="1" style={{ "--i": 1 }} d="M74 48H118" />
        <path className="iso-words" pathLength="1" style={{ "--i": 2 }} d="M74 60H126" />
        <rect className="work__button" x="74" y="70" width="44" height="13" rx="2" />
        <path className="work__cursor" d="M104 78L104 96L109 91.5L113 99L116 97.5L112.5 90.5L119 90Z" />
      </g>
      <Box a={-10} b={42} sa={96} sb={34} h={4} className="is-cream" />
      <Box a={62} b={44} sa={16} sb={24} h={4} className="is-gold" />
    </>
  );
}

function Api() {
  return (
    <>
      <Ground />
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(0 ${-i * 36})`}>
          <Box sa={104} sb={104} h={30} className={["", "is-gold", "is-cream"][i]} />
          <g transform={wall("left", -52, 52, 30)}>
            {[0, 1, 2, 3].map(k => (
              <rect key={k} className="iso-module" style={{ "--i": i * 4 + k }} x={10 + k * 21} y="11" width="16" height="8" />
            ))}
          </g>
          <g className="iso-ink" transform={wall("right", 52, 52, 30)}>
            <path d="M12 15H52" opacity=".45" strokeWidth="3" />
            <path className="is-gold" d="M74 15h.1" strokeWidth="6" />
            <path className="is-teal" d="M88 15h.1" strokeWidth="6" />
          </g>
        </g>
      ))}
      <g className="iso-ink">
        <Link from={[52, 20, 0]} to={[90, 20, 0]} />
        <Link from={[20, 52, 0]} to={[20, 90, 0]} delay={-1.2} color="is-teal" />
      </g>
    </>
  );
}

function Search() {
  return (
    <>
      <Ground />
      {[-58, -20, 18].map((b, row) => (
        <React.Fragment key={b}>
          <Box a={-6} b={b} sa={140} sb={24} h={44} className={["", "is-cream", ""][row]} />
          <g transform={wall("left", -76, b + 12, 44)}>
            {Array.from({ length: 7 }, (_, k) => (
              <rect key={k} className="iso-module" style={{ "--i": (row * 5 + k * 3) % 9 }} x={8 + k * 18.4} y="8" width="13" height="28" />
            ))}
          </g>
        </React.Fragment>
      ))}
      <g className="work__lens iso-ink" transform="translate(38 -62)">
        <circle className="is-gold" r="30" strokeWidth="5" />
        <path className="is-gold" d="M21 21L46 46" strokeWidth="8" />
      </g>
    </>
  );
}

function Learn() {
  const layers = [
    [-66, [-48, -16, 16, 48]],
    [0, [-64, -32, 0, 32, 64]],
    [66, [-32, 0, 32]],
  ];
  return (
    <>
      <Ground s={196} />
      <g className="iso-ink" transform={floor(0)}>
        {[0, 1].map(l =>
          layers[l][1].map((b, i) =>
            layers[l + 1][1].map((c, j) => {
              const d = `M${layers[l][0]} ${b}L${layers[l + 1][0]} ${c}`;
              return (
                <React.Fragment key={d}>
                  <path d={d} opacity=".22" strokeWidth="1" />
                  {(i * 2 + j) % 4 === 0 && (
                    <path className="iso-signal is-gold" d={d} style={{ animationDelay: `${-((i + j * 3 + l * 4) % 7) * 0.37}s` }} />
                  )}
                </React.Fragment>
              );
            })
          )
        )}
      </g>
      {layers.flatMap(([a, bs], l) =>
        bs.map((b, i) => (
          <Box
            key={`${a} ${b}`}
            a={a}
            b={b}
            sa={18}
            sb={18}
            h={[16, 34, 22][l] + ((i * 7) % 12)}
            className={["", "is-cream", "is-gold"][l]}
          />
        ))
      )}
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

const ART = { web: Web, api: Api, search: Search, ml: Learn, net: Net, shell: Terminal };

export function WorkArt({ art }) {
  const Art = ART[art];
  return (
    <svg className="work__art" viewBox="-185 -165 370 285" aria-hidden="true">
      <Art />
    </svg>
  );
}
