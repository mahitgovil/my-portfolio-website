import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import "../styles/hero.css";
import { startHeroMachines } from "./heroMachines";
import { isoView } from "./isoView";
import { useScrollOffset, scrollDuration } from "./scrollConfig";

// The landing screen. The text is also in the static shell in index.html - keep them in sync.

export default function Hero() {
  const scrollOffset = useScrollOffset();
  const [ready, setReady] = useState(false);
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return startHeroMachines({
      section: sectionRef.current,
      hero: heroRef.current,
      name: nameRef.current,
      canvas: canvasRef.current,
      view: isoView,
      onReady: () => setReady(true),
    });
  }, []);

  const scrollProps = {
    smooth: true,
    offset: scrollOffset,
    duration: scrollDuration,
  };

  return (
    <section className="bgimage" id="home" ref={sectionRef}>
      <div className="hero-bg" aria-hidden="true"></div>
      <div className={`hero${ready ? " is-ready" : ""}`} ref={heroRef}>
        <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true"></canvas>
        <div className="container hero__inner">
          <h1 className="hero__title">
            <span className="hero__hi hero__reveal">Hi! I'm </span>
            <span className="hero__name" ref={nameRef}>
              <span className="hero__first" data-line>Mahit</span>{" "}
              <span className="hero__last" data-line>Govil</span>
            </span>
          </h1>
          <p className="hero__lead hero__reveal">
            Every click starts a journey. I build both ends of it, and the road
            between.
          </p>
          <div className="hero__actions hero__reveal">
            <Link
              to="projects"
              href="#projects"
              className="hero__button"
              {...scrollProps}
            >
              See my projects
            </Link>
            <Link
              to="contact"
              href="#contact"
              className="hero__link"
              {...scrollProps}
            >
              Get in touch
            </Link>
            <span className="hero__social">
              <a
                href="https://github.com/mahitgovil"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/mahitgovil/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
