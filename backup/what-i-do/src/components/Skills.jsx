import React from "react";
import "../styles/Skills.css";
import { work } from "../data/work";
import { useLit } from "./useLit";
import { WorkArt } from "./workArt";

export default function Skills() {
  const listRef = useLit();
  return (
    <section id="skills">
      <div className="container">
        <h2 className="about__heading">
          What <span>I do</span>
        </h2>
        <ul className="work" ref={listRef}>
          {work.map(item => (
            <li key={item.art}>
              <WorkArt art={item.art} />
              <h3>{item.title}</h3>
              <ul className="work__tools">
                {item.tools.map(tool => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
