import React from "react";
import "../styles/Projects.css";
import { projects } from "../data/projects";
import { WorkArt } from "./workArt";

const BASE = `${import.meta.env.BASE_URL}assets/projects`;
const srcSet = (id, ext) => [640, 960].map(w => `${BASE}/${id}-${w}.${ext} ${w}w`).join(", ");

// a screenshot, or a drawing for projects without a screen to show
function Shot({ project, sizes }) {
  if (project.art)
    return (
      <span className="shot shot--art is-lit">
        <WorkArt art={project.art} />
      </span>
    );
  return (
    <picture className="shot">
      <source type="image/avif" srcSet={srcSet(project.id, "avif")} sizes={sizes} />
      <img
        src={`${BASE}/${project.id}-960.webp`}
        srcSet={srcSet(project.id, "webp")}
        sizes={sizes}
        width="960"
        height="720"
        alt={`${project.name} screenshot`}
        style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function Tech({ items }) {
  return items.length > 0 && <p className="project__tech">{items.join(", ")}</p>;
}

function Links({ project }) {
  const links = [
    ["Live demo", project.websiteLink],
    ["Code", project.githubLink],
  ].filter(([, href]) => href);
  return (
    links.length > 0 && (
      <p className="project__links">
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}: ${project.name}`}
          >
            {label}
          </a>
        ))}
      </p>
    )
  );
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <h2 className="about__heading">Projects</h2>
        <ul className="pscreens">
          {projects.map(project => (
            <li key={project.id}>
              <div className="pscreens__screen">
                <Shot project={project} sizes="(max-width: 767px) 80vw, 380px" />
              </div>
              <div className="pscreens__text">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <Tech items={project.tech} />
                <Links project={project} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
