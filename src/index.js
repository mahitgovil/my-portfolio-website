import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "./styles/theme.css"; // colour variables for the alternating light/dark sections
import "./styles/decor.css"; // section markers, faint heading words, slanted edges (delete to undo)
import "./styles/responsive.css"; // keep last: shared responsive overrides

// once: animate each element a single time instead of replaying on every pass
// (replaying made sections feel like they were "loading" again after each jump).
AOS.init({
  once: true,
  duration: 600,
  offset: 60,
  easing: "ease-out-cubic",
  disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
