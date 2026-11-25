import React from "react";
import "../styles/Experience.css";
import { experience } from "../data/about";

// a line down the left with a point for each job
export default function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <h2 className="about__heading">Experience</h2>
        <ul className="timeline">
          {experience.map(job => (
            <li key={job.place}>
              <p className="timeline__date">{job.date}</p>
              <h3>
                {job.role}, <span>{job.place}</span>
              </h3>
              <p>{job.text}</p>
              {job.tech.length > 0 && <p className="timeline__tech">{job.tech.join(", ")}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
