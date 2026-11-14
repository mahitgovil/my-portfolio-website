import React from "react";
import Nav from "./navbar";
import About from "./About";
import Contact from "./Contact";
import Project from "./Projects";
import Skills from "./Skills";
import Footer from "./Footer";

export default function App() {
  return (
    <div>
      <Nav />
      <About />
      <Skills />
      <Project />
      <Contact />
      <Footer />
    </div>
  );
}
