import React, { useEffect, useRef } from "react";
import About from "./About";
import TechStack from "./TechStack";
import { startTrailLine } from "./trailLine";

// About and Tech stack, with the line from the hero running through both
export default function Trail() {
  const ref = useRef(null);
  useEffect(() => startTrailLine(ref.current), []);
  return (
    <div className="trail" ref={ref}>
      <svg className="trail__line" aria-hidden="true">
        <path className="route__glow" />
        <path className="route__line" />
        <path className="route__halo" />
        <path className="route__tip" />
      </svg>
      <About />
      <TechStack />
    </div>
  );
}
