import React, { useEffect, useRef, useState } from "react";
import "../styles/TechStack.css";
import { stack } from "../data/stack";

const LINES = stack.length + 2; // and a brace at either end

// how many lines of the file have been typed: it follows the scroll
function useTyped() {
  const ref = useRef(null);
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(LINES);
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = ref.current.getBoundingClientRect();
      const p = (window.innerHeight * 0.88 - r.top) / r.height;
      setTyped(Math.ceil(Math.min(1, Math.max(0, p)) * LINES));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);
  return [ref, typed];
}

export default function TechStack() {
  const [ref, typed] = useTyped();
  const line = i => (i < typed ? "is-on" : undefined);
  return (
    <section id="skills">
      <div className="container">
        <h2 className="about__heading">
          Tech <span>stack</span>
        </h2>
        <div className="file" ref={ref}>
          <div className="term__bar" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <span>skills.json</span>
          </div>
          <ol>
            <li className={line(0)}>{"{"}</li>
            {stack.map((layer, i) => (
              <li key={layer.title} className={line(i + 1)}>
                <b>"{layer.title}"</b>: [
                {layer.tools.map((tool, k) => (
                  <React.Fragment key={tool}>
                    <span>"{tool}"</span>
                    {k < layer.tools.length - 1 && ", "}
                  </React.Fragment>
                ))}
                ]{i < stack.length - 1 && ","}
              </li>
            ))}
            <li className={line(LINES - 1)}>{"}"}</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
