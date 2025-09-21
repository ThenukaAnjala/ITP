// src/pages/HelpDesk.jsx
import React, { useState } from "react";
import "../styles/pages/helpdesk.css"; // ✅ Import CSS file

function HelpDesk() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 Later replace with API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm((f) => ({ ...f, message: "" }));
  };

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-card">
        <div className="helpdesk-header">
          <span className="helpdesk-icon">📞</span>
          <h2>Help Desk</h2>
        </div>

        {submitted && (
          <div className="helpdesk-success">
            ✅ Your help request has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="helpdesk-form">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" name="name" value={form.name} readOnly />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            readOnly
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Describe your issue..."
            value={form.message}
            onChange={handleChange}
            rows="4"
            required
          />

          <button type="submit" className="helpdesk-submit">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default HelpDesk;
