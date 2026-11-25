import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import ThemeSwitch from "./ThemeSwitch";

const LINKS = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["contact", "Contact"],
];

// the last section whose top has gone under the bar
function currentSection() {
  const page = document.documentElement;
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= page.scrollHeight - 2) {
    return LINKS[LINKS.length - 1][0];
  }
  const bar = document.getElementById("navbar").offsetHeight + 4;
  let current = LINKS[0][0];
  LINKS.forEach(([id]) => {
    if (document.getElementById(id).getBoundingClientRect().top <= bar) current = id;
  });
  return current;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 0);
      setCurrent(currentSection());
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = e => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      document.querySelector(".navbar-toggler").focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <nav
      id="navbar"
      aria-label="Main"
      className={`navbar navbar-expand-lg${scrolled ? " scrolled" : ""}${
        menuOpen ? " menu-open" : ""
      }`}
    >
      <div className="container">
        {/* visible below the lg breakpoint */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarCollapse"
          aria-expanded={menuOpen}
          aria-label="Menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          <span className="burger" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className={`navbar-collapse collapse${menuOpen ? " show" : ""}`} id="navbarCollapse">
          <ul className="navbar-nav">
            {LINKS.map(([id, label]) => (
              <li className="nav-item nav-link" key={id}>
                <a
                  href={`#${id}`}
                  className={current === id ? "active" : undefined}
                  aria-current={current === id ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* after the links in the page order, as it is on screen */}
        <ThemeSwitch />
      </div>
    </nav>
  );
}
