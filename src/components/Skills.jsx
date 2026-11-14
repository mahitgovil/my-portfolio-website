import React from "react";
import "../styles/Skills.css";

export default function Skills() {
  return (
    <section
      id="skills"
      className="fabon-service-area section_t_100 section_b_70"
      data-scroll-index="2"
    >
      <div className="container skills-section">
        <div className="row">
          {/* // <-------------------------------------- Skills Area Heading Start ----------------------------------> */}
          <div className="col-md-12">
            <div className="site-heading">
              <h2>what i do</h2>
            </div>
          </div>
        </div>
        {/* // <------------------------------------- Skills Area Heading End ----------------------------------------> */}
        <div className="row">
          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-laptop"></i>
              </div>
              <h4>Web Development</h4>
              <p>
                Adept at bridging the gap between front-end and back-end, I
                bring a holistic approach to development. My proficiency in
                technologies like MERN (MongoDB, Express.js, React, Node.js)
                stack allows me to create end-to-end solutions.
              </p>
              <div className="service-hover">
                <i className="fa fa-laptop"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-github"></i>
              </div>
              <h4>Version Control & Collaboration</h4>
              <p>
                Experienced in using Git for version control, I collaborate
                effectively with teams using platforms like GitHub. I understand
                the importance of clean code and conduct thorough code reviews
                to ensure high-quality deliverables.
              </p>
              <div className="service-hover">
                <a href="#">
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-code"></i>
              </div>
              <h4>Open Source</h4>
              <p>
                Active open source contributor, proficient in collaborative
                coding and issue resolution. Passionate about contributing to
                impactful projects and fostering a culture of shared knowledge
                within the developer community.
              </p>
              <div className="service-hover">
                <a href="#">
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-database"></i>
              </div>
              <h4>Database Management</h4>
              <p>
                As a budding full-stack developer, I'm gaining proficiency in
                database management, specializing in both relational (MySQL,
                PostgreSQL) and NoSQL (MongoDB) databases.
              </p>
              <div className="service-hover">
                <a href="#">
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-gears"></i>
              </div>
              <h4>API Integration</h4>
              <p>
                Skilled in building and consuming RESTful APIs. Leveraging this
                skill set, I seamlessly integrate third-party services and
                functionalities to enhance the overall user experience.
              </p>
              <div className="service-hover">
                <a href="#">
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="single-service">
              <div className="service-icon">
                <i className="fa fa-mobile"></i>
              </div>
              <h4>App Development</h4>
              <p>
                Specializing in Flutter and Dart, creating cross-platform
                experiences with a focus on intuitive design and functionality.
                Eager to contribute to innovative projects and enhance user
                experiences.
              </p>
              <div className="service-hover">
                <a href="#">
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
