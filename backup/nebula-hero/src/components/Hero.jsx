import React, { useEffect, useRef, useState } from "react";
import "../styles/hero.css";
import AnimatedBackground from "./AnimatedBackground";
import { startHeroDust } from "./heroDust";

// The landing screen. The text is also in the static shell in index.html - keep them in sync.

export default function Hero() {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return undefined;
    }
    return startHeroDust({
      section: sectionRef.current,
      hero: heroRef.current,
      name: nameRef.current,
      canvas: canvasRef.current,
      image: sectionRef.current.querySelector(".hero-bg"),
      onReady: () => setReady(true),
    });
  }, []);

  return (
    <section className="bgimage" id="home" ref={sectionRef}>
      <AnimatedBackground />
      <div className={`hero${ready ? " is-ready" : ""}`} ref={heroRef}>
        <canvas className="hero__dust" ref={canvasRef} aria-hidden="true"></canvas>
        <div className="container hero__inner">
          <h1 className="hero__title">
            <span className="hero__hi hero__reveal">Hi! I'm </span>
            <span className="hero__name" ref={nameRef}>
              <span className="hero__first" data-dust>Mahit</span>{" "}
              <span className="hero__last" data-dust>Govil</span>
            </span>
          </h1>
          <p className="hero__lead hero__reveal">
            I understand things by building them. So far, that means my own shell, a
            P2P BitTorrent system and a mini search engine.
          </p>
          <div className="hero__actions hero__reveal">
            <a href="#projects" className="hero__button">
              See my projects
            </a>
            <a href="#contact" className="hero__link">
              Get in touch
            </a>
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
