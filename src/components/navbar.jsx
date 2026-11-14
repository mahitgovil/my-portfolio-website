import React from "react";
import { Link } from "react-scroll";
import "../styles/navbar.css";
import AnimatedBackground from "./AnimatedBackground";

export default function Nav() {
  // add className scrolled on navbar scroll
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 0) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  return (
    <div>
      {/*-------------------------------------- Navbar Start ---------------------------------------------- */}
      <nav id="navbar" className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          {/* <!-- LOGO --> */}
          <a className="navbar-brand logo" href="index.html">
            MG
          </a>
          <div className="navbar-collapse collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item nav-link">
                {/* <a
                  href="#"
                  id="home-link"
                  className="nav-link"
                  data-scroll-nav="0"
                >
                  Home
                </a> */}
                <Link
                  activeClass="active"
                  to="home"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  // className=""
                >
                  Home
                </Link>
              </li>
              <li className="nav-item nav-link">
                {/* <a
                  href="#about"
                  id="about-link"
                  className="nav-link"
                  data-scroll-nav="1"
                >
                  About
                </a> */}
                <Link
                  activeClass="active"
                  to="about"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  About
                </Link>
              </li>
              <li className="nav-item nav-link">
                {/* <a
                  href="#skills"
                  id="skills-link"
                  className="nav-link"
                  data-scroll-nav="2"
                >
                  Skills
                </a> */}
                <Link
                  activeClass="active"
                  to="skills"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Skills
                </Link>
              </li>
              <li className="nav-item nav-link">
                {/* <a
                  href="#projects"
                  id="projects-link"
                  className="nav-link"
                  data-scroll-nav="3"
                >
                  Projects
                </a> */}
                <Link
                  activeClass="active"
                  to="projects"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Projects
                </Link>
              </li>
              <li className="nav-item nav-link">
                {/* <a
                  href="#contact"
                  id="contact-link"
                  className="nav-link"
                  data-scroll-nav="4"
                >
                  Contact
                </a> */}
                <Link
                  activeClass="active"
                  to="contact"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
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
        {/* <a href="#about" data-scroll-nav="1" className="mouse-icon hidden-sm">
          <div className="wheel scroller"></div>
        </a> */}
        <a>
          <Link
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="mouse-icon hidden-sm"
          >
            <div className="wheel scroller"></div>
          </Link>
        </a>
      </section>
    </div>
  );
}
