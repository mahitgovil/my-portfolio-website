import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

const EMAIL = "mahitgovil@live.com";

const LINKS = [
  ["LinkedIn", "https://www.linkedin.com/in/mahitgovil/"],
  ["GitHub", "https://github.com/mahitgovil"],
];

const EMPTY = { name: "", email: "", message: "" };

// status: "", "sending", "sent" or "error"
function useContactForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState("");

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear the previous result as soon as the visitor starts typing again
    if (status !== "sending") setStatus("");
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await axios.post("https://formspree.io/f/mrgnyqkd", formData, {
        // Formspree requires the Content-Type to be set to 'application/json'
        headers: { "Content-Type": "application/json" },
      });
      setFormData(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const bind = name => ({
    id: `contact-${name}`,
    name,
    value: formData[name],
    onChange,
    required: true,
    ...(name !== "message" && { type: name === "email" ? "email" : "text", autoComplete: name }),
  });

  return { bind, onSubmit, status };
}

// always rendered so screen readers announce the result
const Status = ({ status }) => (
  <p className={`contact__status is-${status}`} role="status">
    {status === "sent" && "Sent. I'll get back to you soon."}
    {status === "error" && (
      <>
        That didn't send. Try again, or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </>
    )}
  </p>
);

// the form is a shell session
export default function Contact() {
  const { bind, onSubmit, status } = useContactForm();
  return (
    <section id="contact">
      <div className="container">
        <h2 className="about__heading">
          Get in <span>touch</span>
        </h2>
        <p className="contact__open">I'm open to work.</p>
        <form className="term" onSubmit={onSubmit}>
          <div className="term__bar" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div className="term__body">
            <p aria-hidden="true">
              <b>$</b> contact mahit
            </p>
            {["name", "email", "message"].map(name => (
              <div className="term__line" key={name}>
                <label htmlFor={`contact-${name}`}>{name}:</label>
                {name === "message" ? (
                  <textarea rows={4} {...bind(name)} />
                ) : (
                  <input {...bind(name)} />
                )}
              </div>
            ))}
            <div className="term__line term__line--send">
              <b aria-hidden="true">$</b>
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "sending…" : "send"}
              </button>
            </div>
            <Status status={status} />
          </div>
        </form>
        <div className="contact__row">
          <a className="contact__email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <p className="contact__profiles">
            {LINKS.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
