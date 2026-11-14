import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <div>
      <section id="about">
        <div className="container mt-4 pt-4 site-heading ">
          <h2 style={{ marginTop: "50px" }} className="text-center">
            About Me
          </h2>
          <div className="about__content">
            <div className="row mt-4 about__content-detail">
              <p className="about__content-details-para">
                {" "}
                Hi there! I'm Mahit and I enjoy creating things that live on the
                internet. My journey into web development began in 2022 during
                my second year of college, and since then, I've been crafting
                diverse websites and apps. Fueled by a passion for the
                ever-evolving world of web development, I blend creativity with
                functionality to build immersive digital experiences. Join me on
                this exciting journey where innovation and code converge!
              </p>

              <p className="about__content-details-para">
                {" "}
                Outside the realm of pixels and code, you'll find me playing{" "}
                <strong>football</strong> or <strong>badminton</strong>, reading{" "}
                <strong>books</strong> or working out in the{" "}
                <strong>gym</strong>, drawing inspiration from the world around
                me. This portfolio is more than a showcase; it's a glimpse into
                my journey, a testament to the passion and dedication I pour
                into every project.
              </p>
              <p className="about__content-details-para">
                {" "}
                I'm open to <strong>Job</strong> opportunities where I can
                contribute, learn and grow. If you have a good opportunity that
                matches my skills then don't hesitate to{" "}
                <strong>contact</strong> me.
              </p>
              <a href="#contact">
                <button id="contact-redirect">Contact Me</button>
              </a>
            </div>
            <div className="about__content-skills">
              <h3 className="about__content-title">My Tech Stack</h3>
              <div className="skills">
                <div className="skills__skill">C/C++</div>
                <div className="skills__skill">Python</div>
                <div className="skills__skill">HTML</div>
                <div className="skills__skill">CSS</div>
                <div className="skills__skill">JavaScript</div>
                <div className="skills__skill">ReactJs</div>
                <div className="skills__skill">NextJs</div>
                <div className="skills__skill">ExpressJs</div>
                <div className="skills__skill">NodeJs</div>
                <div className="skills__skill">GIT</div>
                <div className="skills__skill">Github</div>
                <div className="skills__skill">MySQL</div>
                <div className="skills__skill">PostgreSQL</div>
                <div className="skills__skill">MongoDB</div>
                <div className="skills__skill">FireBase</div>
                <div className="skills__skill">Flutter</div>
                <div className="skills__skill">Linux Basics</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
