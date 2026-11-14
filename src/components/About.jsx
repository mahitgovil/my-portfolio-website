import React from "react";
import { Link } from "react-scroll";
import "../styles/About.css";
import { useScrollOffset, scrollDuration } from "./scrollConfig";

export default function About() {
  const scrollOffset = useScrollOffset();
  return (
    <section id="about">
      <div className="container mt-4 pt-4 site-heading">
        <h2 style={{ marginTop: "50px" }} className="text-center">
          About Me
        </h2>
        <div className="about__content">
          <div className="row mt-4 about__content-detail">
            <h3 className="about__content-title">Get to know me!</h3>
            <div data-aos="fade-right" data-aos-duration="600">
              <p className="about__content-details-para">
                {" "}
                Hi there! I'm Mahit and I enjoy creating things that live on the
                internet. My journey into web development began in 2022 during
                my second year of college, and since then, I've been crafting
                diverse websites and apps. This portfolio is more than a
                showcase, it's a glimpse into my journey, a testament to the
                passion and dedication I pour into every project.
              </p>

              <p className="about__content-details-para">
                {" "}
                Outside the realm of pixels and code, you'll find me playing{" "}
                <strong>football</strong> or <strong>badminton</strong>, reading{" "}
                <strong>books</strong> or working out in the{" "}
                <strong>gym</strong>, drawing inspiration from the world around
                me.
              </p>
              <p className="about__content-details-para">
                {" "}
                I'm open to <strong>Job</strong> opportunities where I can
                contribute, learn and grow. If you have a good opportunity that
                matches my skills then don't hesitate to{" "}
                <strong>contact</strong> me.
              </p>
            </div>
            <div data-aos="fade-right" data-aos-duration="700">
              <Link
                to="contact"
                href="#contact"
                smooth={true}
                offset={scrollOffset}
                duration={scrollDuration}
              >
                <button id="contact-redirect">Contact Me</button>
              </Link>
            </div>
          </div>
          <div className="about__content-skills">
            <h3 className="about__content-title">My Tech Stack</h3>
            <div
              data-aos="fade-left"
              data-aos-duration="600"
              className="skills sibling-fade"
            >
              <div className="skills__skill">C/C++</div>
              <div className="skills__skill">Java</div>
              <div className="skills__skill">Python</div>
              <div className="skills__skill">Dart</div>
              <div className="skills__skill">JavaScript</div>
              <div className="skills__skill">ReactJs</div>
              <div className="skills__skill">NextJs</div>
              <div className="skills__skill">NodeJs</div>
              <div className="skills__skill">Spring Boot</div>
              <div className="skills__skill">Flutter</div>
              <div className="skills__skill">GIT</div>
              <div className="skills__skill">Github</div>
              <div className="skills__skill">MySQL</div>
              <div className="skills__skill">PostgreSQL</div>
              <div className="skills__skill">MongoDB</div>
              <div className="skills__skill">FireBase</div>
              <div className="skills__skill">Data Structures</div>
              <div className="skills__skill">Algorithms</div>
            </div>
          </div>
        </div>
        <div className="experience-container">
          <div className="site-heading container mt-4 pt-4">
            <h4 className="text-center">Experience</h4>
          </div>
          <ul className="experience-list">
            <li
              data-aos="fade-in"
              data-aos-duration="600"
              style={{ "--accent-color": "#666" }}
            >
              <div class="date">March - Oct 2024</div>
              <div class="title">
                Software Intern(Full Stack) <strong>@Daira Edtech</strong>
              </div>
              <div class="descr">
              <ul>
              <li>Implemented an open-source speech-to-text model Deep Speech to optimize transcription processes.</li>
              <li>Tech Stack: Python, Python APIs, ReactJs, Git, DeepSpeech.</li>
              </ul>
                 
              </div>
            </li>
            <li
              data-aos="fade-in"
              data-aos-duration="600"
              style={{ "--accent-color": "#666" }}
            >
              <div class="date">May - July 2023</div>
              <div class="title">
                Engineer Trainee <strong>@CEL</strong>
              </div>
              <div class="descr">
                Engineer Trainee at Central Electronics Limited (CEL), gaining hands-on experience in electronic system design, testing, and project execution.
              </div>
            </li>
          </ul>
        </div>
        {/* <div className="experience-container">
          <div className="site-heading container mt-4 pt-4">
            <h4 className="text-center">Certifications</h4>
          </div>
        </div> */}
        <div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
            data-name="bmc-button"
            data-slug="mahitgovil"
            data-color="#ababab"
            data-emoji="☕"
            data-font="Poppins"
            data-text="Buy me a coffee"
            data-outline-color="#000000"
            data-font-color="#000000"
            data-coffee-color="#FFDD00"
          `,
            }}
          />
        </div>
      </div>
    </section>
  );
}
