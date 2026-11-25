import React from "react";
import "../styles/Projects.css";
import { projects } from "../data/projects";
import { WorkArt } from "./workArt";

const BASE = `${import.meta.env.BASE_URL}assets/projects`;
const srcSet = (id, ext) => [640, 960].map(w => `${BASE}/${id}-${w}.${ext} ${w}w`).join(", ");

function Picture({ project, sizes, id = project.id, className = "" }) {
  return (
    <picture className={`shot ${className}`}>
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <img
        src={`${BASE}/${id}-960.webp`}
        srcSet={srcSet(id, "webp")}
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

// a screenshot, or a drawing for projects without a screen to show
function Shot({ project, sizes }) {
  if (project.art)
    return (
      <span className="shot shot--art is-lit">
        <WorkArt art={project.art} />
      </span>
    );
  // the app has a light theme too: show the matching one (the hidden one is never downloaded)
  if (project.lightImage)
    return (
      <>
        <Picture project={project} sizes={sizes} className="shot--for-dark" />
        <Picture project={project} sizes={sizes} id={`${project.id}-light`} className="shot--for-light" />
      </>
    );
  return <Picture project={project} sizes={sizes} />;
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
        <ul className="pgrid">
          {projects.map(project => (
            <li key={project.id} className={project.featured ? "pgrid__big" : "pgrid__small"}>
              <Shot
                project={project}
                sizes={project.featured ? "(max-width: 767px) 92vw, 620px" : "(max-width: 767px) 120px, 410px"}
              />
              <div className="pgrid__text">
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
