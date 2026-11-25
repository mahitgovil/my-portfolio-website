import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "./styles/theme.css"; // colours and page defaults
import "./styles/decor.css";
import "./styles/responsive.css"; // keep last: shared responsive overrides

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
