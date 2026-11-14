import React from "react";
import "../styles/Projects.css";

export default function Project() {
  return (
    <section id="projects">
      <div class="site-heading">
        <p class="section__text__p1">Browse My Recent</p>
        <h2 class="title">Projects</h2>
      </div>
      <div class="about-details-container">
        <div class="about-containers">
          {/* <------------------------------------------ Project 1 Start --------------------------------------> */}
          <div class="details-container">
            <div class="">
              <img
                src="/assets/todoList.png"
                alt="Project 1"
                class="project-img"
              />
            </div>
            <h2 class="project-title">Project One</h2>
            <div class="btn-container">
              <a href="https://github.com/mahitgovil/ToDo-List">
                <button class="btn btn-color-2 project-btn">Github</button>
              </a>
              <a href="">
                <button class="btn btn-color-2 project-btn">Live Demo</button>
              </a>
            </div>
          </div>
          {/* <------------------------------------------ Project 1 End --------------------------------------> */}

          <div class="details-container">
            <div class="">
              <img
                src="/assets/sudokuSolver.png"
                alt="Project 2"
                class="project-img"
              />
            </div>
            <h2 class="project-title">Project Two</h2>
            <div class="btn-container">
              <a href="https://github.com/mahitgovil/Sudoku-Solver">
                <button class="btn btn-color-2 project-btn">Github</button>
              </a>
              <a href="https://sudoku-solver-nine.vercel.app/">
                <button class="btn btn-color-2 project-btn">Live Demo</button>
              </a>
            </div>
          </div>
          {/* <------------------------------------------ Project 2 End --------------------------------------> */}

          <div class="details-container">
            <div class="">
              <img
                src="./assets/project-3.png"
                alt="Project 3"
                class="project-img"
              />
            </div>
            <h2 class="project-title">Project Three</h2>
            <div class="btn-container">
              <a href="">
                <button class="btn btn-color-2 project-btn">Github</button>
              </a>
              <a href="">
                <button class="btn btn-color-2 project-btn">Live Demo</button>
              </a>
            </div>
          </div>
          {/* <------------------------------------------ Project 3 End --------------------------------------> */}
        </div>
      </div>
    </section>
  );
}
