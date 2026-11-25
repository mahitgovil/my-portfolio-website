import React from "react";
import "../styles/About.css";
import { intro } from "../data/about";
import { Room } from "./aboutArt";

export default function About() {
  return (
    <section id="about">
      <div className="about__floor" aria-hidden="true"></div>
      <div className="container">
        <div className="about__me">
          <div>
            <h2 className="about__heading">
              About <span>me</span>
            </h2>
            <p className="about__lead">
              {intro.lead.split(" ").map((word, i) => (
                <React.Fragment key={i}>
                  <span>{word}</span>{" "}
                </React.Fragment>
              ))}
            </p>
            <p className="about__text">{intro.work}</p>
            <p className="about__text">{intro.life}</p>
          </div>
          <Room />
        </div>
      </div>
    </section>
  );
}
