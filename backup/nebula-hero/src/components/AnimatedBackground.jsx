import React, { useCallback, useEffect, useRef } from "react";
import "../styles/animatedbackground.css";
import { startHeroSwarm } from "./heroSwarm";

// Hero image variants live in public/assets/hero/ (generated from the original space.jpg).
// The same <picture> is in the static shell in public/index.html (so the image downloads and
// shows before this bundle has even loaded) - keep the two in sync.
const HERO_BASE = `${import.meta.env.BASE_URL}assets/hero/hero`;
// The picture is larger than the screen and cropped, so 100vw would pick too small a file (it
// looked blurry on phones). Matches the .hero-bg box in animatedbackground.css.
const HERO_SIZES = "(max-width: 768px) max(100vw, 111vh), max(120vw, 214vh)";
const HERO_WIDTHS = [640, 960, 1280, 1920];
const heroSrcSet = ext =>
  HERO_WIDTHS.map(w => `${HERO_BASE}-${w}.${ext} ${w}w`).join(", ");

export default function AnimatedBackground() {
  // Fade the image in once it has loaded. If it is already cached/preloaded by the time this
  // mounts, show it straight away (no fade, no flash of the placeholder).
  const heroImgRef = useCallback(img => {
    if (img && img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
    }
  }, []);

  const headerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(
    () =>
      startHeroSwarm({
        header: headerRef.current,
        canvas: canvasRef.current,
        image: headerRef.current.querySelector(".hero-bg"),
      }),
    []
  );

  return (
    <div id="large-header" className="large-header" ref={headerRef}>
      <picture className="hero-bg">
        <source type="image/avif" srcSet={heroSrcSet("avif")} sizes={HERO_SIZES} />
        <source type="image/webp" srcSet={heroSrcSet("webp")} sizes={HERO_SIZES} />
        <img
          ref={heroImgRef}
          // if the static shell's copy already finished loading, start fully visible so there is
          // no fade/flash when React swaps the shell for this element
          className={`hero-bg__img${window.__heroLoaded ? " is-loaded" : ""}`}
          src={`${HERO_BASE}-1280.jpg`}
          srcSet={heroSrcSet("jpg")}
          sizes={HERO_SIZES}
          alt=""
          fetchpriority="high"
          onLoad={e => e.currentTarget.classList.add("is-loaded")}
        />
      </picture>
      <canvas className="hero-swarm" ref={canvasRef} aria-hidden="true"></canvas>
    </div>
  );
}
