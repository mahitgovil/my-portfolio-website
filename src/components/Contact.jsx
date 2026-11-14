import React, { useState } from "react";
import "../styles/Contact.css";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      console.log(response.data);
      setFormData({ name: "", email: "", message: "" });
      setMessage("Message has been sent successfully. Thanks");
      setIsError(false);
    } catch (err) {
      console.log(err);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <section id="contact">
      <div className="container mt-3 contactContent site-heading contact-detail">
        <h2 className="text-center">Get in Touch</h2>
        <span className="heading-sec__sub">
          Feel free to Contact me by submitting the form below and I will get
          back to you as soon as possible
        </span>

        <div className="col-lg-6 contact__form-container">
          {/* <!-------------------------- form fields --------------------------------> */}
          <form onSubmit={handleSubmit}>
            <div className="contact__form-field">
              <label className="contact__form-label" for="name">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                className="form-control form-control-lg contact__form-input"
                placeholder="Enter Your Name"
                onChange={handleChange}
              />
            </div>
            <div className="contact__form-field">
              <label className="contact__form-label" for="name">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                className="form-control mt-3 contact__form-input"
                placeholder="Enter Your Email"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 mt-3 contact__form-field">
              <label className="contact__form-label" for="name">
                Message
              </label>
              <textarea
                name="message"
                className="form-control contact__form-input"
                value={formData.message}
                rows="5"
                id="comment"
                placeholder="Enter Your Message"
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" id="contact-submit">
              Contact Me
            </button>
          </form>
          {message && (
            <p classNameName={`message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
