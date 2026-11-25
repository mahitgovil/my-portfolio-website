import React, { useEffect, useRef } from "react";
import { Link } from "react-scroll";
import "../styles/About.css";
import { intro, stack, experience } from "../data/about";
import { StackSlab, Stop } from "./aboutArt";
import { startAboutLine } from "./aboutLine";
import { useScrollOffset, scrollDuration } from "./scrollConfig";

export default function About() {
  const scrollOffset = useScrollOffset();
  const sectionRef = useRef(null);
  const leadRef = useRef(null);

  useEffect(
    () => startAboutLine({ section: sectionRef.current, lead: leadRef.current }),
    []
  );

  return (
    <section id="about" ref={sectionRef}>
      {/* from the hero to the first job; aboutLine.js draws it */}
      <svg className="about__line" ref={leadRef} aria-hidden="true">
        <path className="route__line" />
        <path className="route__tip" />
      </svg>
      <div className="container">
        <div className="about__top">
          <div className="about__intro">
            <h2 className="about__heading">
              About <span>me</span>
            </h2>
            <p className="about__lead">{intro.lead}</p>
            <p className="about__text">{intro.offline}</p>
          </div>

          <div className="about__stack">
            <h3 className="about__subheading">My tech stack</h3>
            <ul className="stack">
              {stack.map((layer, i) => (
                <li
                  key={layer.name}
                  className="stack__layer"
                  style={{ zIndex: stack.length - i }}
                >
                  <StackSlab art={layer.art} />
                  <div className="stack__label">
                    <h4>{layer.name}</h4>
                    <p>{layer.items.join(", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="about__heading">Experience</h2>
        <ol className="stops">
          {experience.map((job, i) => (
            <li className="stop" key={job.place}>
              <Stop art={job.art} first={i === 0} />
              <div className="stop__text">
                <p className="stop__date">{job.date}</p>
                <h3>{job.role}</h3>
                <p className="stop__place">{job.place}</p>
                <p>{job.text}</p>
                {job.tech.length > 0 && (
                  <p className="stop__tech">{job.tech.join(", ")}</p>
                )}
              </div>
            </li>
          ))}
          <li className="stop">
            <Stop art="next" last />
            <div className="stop__text">
              <p className="stop__date">Next</p>
              <h3>Your team?</h3>
              <p>{intro.next}</p>
              <Link
                to="contact"
                href="#contact"
                className="about__button"
                smooth={true}
                offset={scrollOffset}
                duration={scrollDuration}
              >
                Get in touch
              </Link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
