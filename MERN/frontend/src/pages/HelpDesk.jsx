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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Help Request Sent:\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`
    );
    // 👉 Backend API call can be added here
  };

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-card">
        <div className="helpdesk-header">
          <span className="helpdesk-icon">📞</span>
          <h2>Help Desk</h2>
        </div>

        <form onSubmit={handleSubmit} className="helpdesk-form">
          <label>Full Name</label>
          <input type="text" name="name" value={form.name} readOnly />

          <label>Email</label>
          <input type="email" name="email" value={form.email} readOnly />

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Describe your issue..."
            value={form.message}
            onChange={handleChange}
          />

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default HelpDesk;
