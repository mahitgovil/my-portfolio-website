import React from "react";
import "../styles/Footer.css";

// LinkedIn, GitHub and email are in the Contact section just above
const LINKS = [
  ["Twitter", "https://twitter.com/GovilMahit"],
  ["Instagram", "https://www.instagram.com/mahitgovil"],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Mahit Govil</p>
        <ul>
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#home">
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
