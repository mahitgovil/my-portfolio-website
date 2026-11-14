import React, { useState } from "react";
import "../styles/Projects.css";
import { projects } from "../data/projects";

const FILTERS = ["All", "Web Development", "App Dev", "Machine Learning"];

const STATUS_LABELS = {
  live: "Live",
  "open-source": "Open source",
  "in-progress": "In progress",
  private: "Private",
};

// Thumbnails live in public/assets/projects/ (see the notes at the bottom of src/data/projects.js)
const THUMB_BASE = `${import.meta.env.BASE_URL}assets/projects`;
const THUMB_WIDTHS = [640, 960];
const thumbSrcSet = (id, ext) =>
  THUMB_WIDTHS.map(w => `${THUMB_BASE}/${id}-${w}.${ext} ${w}w`).join(", ");
// how wide the tile is at each breakpoint, so the browser downloads the right size
const THUMB_SIZES =
  "(max-width: 480px) calc(100vw - 2rem), (max-width: 768px) calc(50vw - 1.5rem), 380px";

// Only real links become buttons: empty links are skipped (they used to reload the page),
// and when the "website" is just the GitHub repo it is shown once, as "Code".
function getProjectLinks(project) {
  const links = [];
  const { websiteLink, githubLink } = project;
  if (websiteLink && websiteLink !== githubLink) {
    links.push({
      kind: "demo",
      label: "Live demo",
      icon: "fa-external-link",
      href: websiteLink,
    });
  }
  if (githubLink) {
    links.push({
      kind: "code",
      label: "Code",
      icon: "fa-github",
      href: githubLink,
    });
  }
  return links;
}

export default function Project() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [hasFiltered, setHasFiltered] = useState(false);

  const handleFilter = filter => {
    if (filter === selectedFilter) return;
    setSelectedFilter(filter);
    setHasFiltered(true);
  };

  const filteredProjects =
    selectedFilter === "All"
      ? projects
      : projects.filter(project => project.type === selectedFilter);

  return (
    <section id="projects">
      <div className="site-heading">
        <p className="section__text__p1">Browse My Recent</p>
        <h2 className="title">Projects</h2>
      </div>
      <div className="filter-title" role="group" aria-label="Filter projects">
        {FILTERS.map(filter => (
          <button
            type="button"
            key={filter}
            className={`filter-category ${
              selectedFilter === filter ? "selected-filter" : ""
            }`}
            aria-pressed={selectedFilter === filter}
            onClick={() => handleFilter(filter)}
          >
            <span>{filter}</span>
          </button>
        ))}
      </div>
      {/* key={selectedFilter} re-mounts the grid on a filter change so every tile replays its
          entrance animation (only after the first filter click, not on page load) */}
      <div
        className={`projectPage${hasFiltered ? " projectPage--animate" : ""}`}
        key={selectedFilter}
      >
        {filteredProjects.map((project, index) => {
          const links = getProjectLinks(project);
          return (
            <article
              className="project-item"
              key={project.id}
              style={{ "--i": index }}
            >
              <picture className="project-picture">
                <source
                  type="image/avif"
                  srcSet={thumbSrcSet(project.id, "avif")}
                  sizes={THUMB_SIZES}
                />
                <source
                  type="image/webp"
                  srcSet={thumbSrcSet(project.id, "webp")}
                  sizes={THUMB_SIZES}
                />
                <img
                  src={`${THUMB_BASE}/${project.id}-960.webp`}
                  srcSet={thumbSrcSet(project.id, "webp")}
                  sizes={THUMB_SIZES}
                  width="960"
                  height="720"
                  alt={`${project.name} screenshot`}
                  style={
                    project.imagePosition
                      ? { objectPosition: project.imagePosition }
                      : undefined
                  }
                  loading="lazy"
                  decoding="async"
                />
              </picture>

              {project.status && (
                <span
                  className={`project-status project-status--${project.status}`}
                >
                  <span className="project-status__dot" aria-hidden="true"></span>
                  {STATUS_LABELS[project.status]}
                </span>
              )}

              <div className="overlay">
                <div className="overlay-content">
                  <div className="project-text">
                    <span className="project-type">{project.type}</span>
                    <h3 className="project-name">{project.name}</h3>
                    {project.description && (
                      <p className="project-desc">{project.description}</p>
                    )}
                    {project.tech.length > 0 && (
                      <ul className="project-tech" aria-label="Technologies used">
                        {project.tech.map(t => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {links.length > 0 && (
                    <div className="cap">
                      {links.map(link => (
                        <a
                          key={link.label}
                          className={`project-link project-link--${link.kind}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label}: ${project.name}`}
                        >
                          <i className={`fa ${link.icon}`} aria-hidden="true"></i>
                          <span className="project-link__label">
                            {link.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
