import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-area">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h3>MahitGovil._</h3>
            <ul>
              <li>
                <a href="https://www.linkedin.com/in/mahitgovil/">
                  <i className="fa fa-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="https://github.com/mahitgovil">
                  <i className="fa fa-github"></i>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/GovilMahit">
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/mahitgovil">
                  <i className="fa fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="mailto:mahitgovil@live.com">
                  <i className="fa fa-envelope"></i>
                </a>
              </li>
            </ul>
            <p>© Copyright {currentYear}. Designed & built by Mahit Govil.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
