import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import "../styles/navbar.css";
import AnimatedBackground from "./AnimatedBackground";
import { useScrollOffset, scrollDuration } from "./scrollConfig";

export default function Nav() {
  const scrollOffset = useScrollOffset();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // add className scrolled on navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div>
      {/*-------------------------------------- Navbar Start ---------------------------------------------- */}
      <nav
        id="navbar"
        className={`navbar navbar-expand-lg navbar-dark${
          scrolled ? " scrolled" : ""
        }${menuOpen ? " menu-open" : ""}`}
      >
        <div className="container">
          {/* <!-- LOGO --> */}
          <a className="navbar-brand logo" href="index.html">
            MG
          </a>
          {/* <!-- Burger button (visible below the lg breakpoint) --> */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarCollapse"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span className="burger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div
            className={`navbar-collapse collapse${menuOpen ? " show" : ""}`}
            id="navbarCollapse"
          >
            <ul className="navbar-nav ml-auto">
              <li className="nav-link">
                <Link
                  activeClass="active"
                  to="home"
                  href="#home"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  activeClass="active"
                  to="about"
                  href="#about"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  activeClass="active"
                  to="skills"
                  href="#skills"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                  onClick={closeMenu}
                >
                  Skills
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  activeClass="active"
                  to="projects"
                  href="#projects"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                  onClick={closeMenu}
                >
                  Projects
                </Link>
              </li>
              <li className="nav-item nav-link">
                {/* <Link
                  activeClass="active"
                  to="https://mahitgovil.hashnode.dev/"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                >
                  Blog
                </Link> */}
                <a
                  href="https://mahitgovil.hashnode.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  Blog
                </a>
              </li>
              <li className="nav-item nav-link">
                <Link
                  activeClass="active"
                  to="contact"
                  href="#contact"
                  spy={true}
                  smooth={true}
                  offset={scrollOffset}
                  duration={scrollDuration}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <------------------------------------ Navbar End ----------------------------------------------> */}
      <section className="bgimage" id="home">
        <AnimatedBackground />
        <Link
          to="about"
          href="#about"
          smooth={true}
          offset={scrollOffset}
          duration={scrollDuration}
          className="mouse-icon hidden-sm"
          aria-label="Scroll down to the About section"
        >
          <span className="wheel scroller"></span>
        </Link>
      </section>
    </div>
  );
}
