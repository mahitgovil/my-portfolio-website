import React, { useEffect } from "react";
import Nav from "./navbar";
import Hero from "./Hero";
import Trail from "./Trail";
import Contact from "./Contact";
import Project from "./Projects";
import Experience from "./Experience";
import Footer from "./Footer";

export default function App() {
  // the sections do not exist yet when the browser looks for a #section in the address
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const nav = document.getElementById("navbar");
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - nav.offsetHeight + 2), behavior: "instant" });
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trail />
        <Experience />
        <Project />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
