import React, { useState } from "react";
import "../styles/Contact.css";
import axios from "axios";

// Direct ways to reach me (same destinations as the footer icons)
const CONTACT_LINKS = [
  {
    icon: "fa-envelope",
    label: "Email",
    value: "mahitgovil@live.com",
    href: "mailto:mahitgovil@live.com",
  },
  {
    icon: "fa-linkedin",
    label: "LinkedIn",
    value: "in/mahitgovil",
    href: "https://www.linkedin.com/in/mahitgovil/",
  },
  {
    icon: "fa-github",
    label: "GitHub",
    value: "github.com/mahitgovil",
    href: "https://github.com/mahitgovil",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear the previous result as soon as the visitor starts typing again
    if (message) setMessage("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setMessage("");
    try {
      const response = await axios.post(
        "https://formspree.io/f/mrgnyqkd",
        formData,
        {
          headers: {
            // Formspree requires the Content-Type to be set to 'application/json'
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setFormData({ name: "", email: "", message: "" });
      setMessage("Message has been sent successfully. Thanks");
      setIsError(false);
    } catch (err) {
      console.log(err);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact">
      <div className="container mt-3 contactContent site-heading contact-detail">
        {/* <!-------------------------- form Header ------------------------------------> */}

        <h2 className="text-center">Get in Touch</h2>
        {/* <!-------------------------- form SubHeading --------------------------------> */}

        <span className="heading-sec__sub">
          Feel free to Contact me by submitting the form below and I will get
          back to you as soon as possible
        </span>

        <div className="contact__layout">
          {/* <!-------------------------- info card --------------------------------> */}
          <aside className="contact__info" data-aos="fade-up">
            <span className="contact__badge">
              <span className="contact__badge-dot" aria-hidden="true"></span>
              Open to opportunities
            </span>
            <h3 className="contact__info-title">
              Let's build something together.
            </h3>
            <p className="contact__info-text">
              Have a role, a project or just a question in mind? Send a message
              or reach out directly through any of these.
            </p>

            <ul className="contact__links">
              {CONTACT_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="contact__links-icon" aria-hidden="true">
                      <i className={`fa ${link.icon}`}></i>
                    </span>
                    <span className="contact__links-text">
                      <span className="contact__links-label">{link.label}</span>
                      <span className="contact__links-value">{link.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* <!-------------------------- form card --------------------------------> */}
          <div
            className="contact__form-card"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 className="contact__form-title">Send me a message</h3>

            <form onSubmit={handleSubmit}>
              <div className="contact__form-row">
                <div className="contact__form-field">
                  <label className="contact__form-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    className="contact__form-input"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="contact__form-field">
                  <label
                    className="contact__form-label"
                    htmlFor="contact-email"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    className="contact__form-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact__form-field">
                <label
                  className="contact__form-label"
                  htmlFor="contact-message"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact__form-input"
                  value={formData.message}
                  rows="6"
                  placeholder="How can I help?"
                  required
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="contact__form-footer">
                <p className="contact__hint">
                  I'll get back to you as soon as possible.
                </p>
                <button type="submit" id="contact-submit" disabled={sending}>
                  {sending ? (
                    <>
                      <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <i className="fa fa-paper-plane" aria-hidden="true"></i>
                    </>
                  )}
                </button>
              </div>

              {/* always rendered so screen readers announce the result */}
              <div role="status" aria-live="polite">
                {message && (
                  <p
                    className={`message ${isError ? "error" : "success"}`}
                  >
                    <i
                      className={`fa ${
                        isError ? "fa-exclamation-circle" : "fa-check-circle"
                      }`}
                      aria-hidden="true"
                    ></i>
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
