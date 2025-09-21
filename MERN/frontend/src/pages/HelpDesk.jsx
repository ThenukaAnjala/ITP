// src/pages/HelpDesk.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/helpdesk.css";

function HelpDesk() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [showTickets, setShowTickets] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Unable to start task timer",
      status: "Open",
      date: "2025-09-15",
    },
    {
      id: 2,
      subject: "Login issue in mobile app",
      status: "Resolved",
      date: "2025-09-12",
    },
  ]);

  const [editingTicket, setEditingTicket] = useState(null);
  const [editSubject, setEditSubject] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: Date.now(),
      subject: form.message,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };
    setTickets((prev) => [...prev, newTicket]);
    setSuccess("✅ Your help request has been submitted successfully.");
    setForm({
      name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      message: "",
    });
  };

  // 🟢 Edit ticket
  const handleEdit = (ticket) => {
    setEditingTicket(ticket.id);
    setEditSubject(ticket.subject);
  };

  const handleSaveEdit = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, subject: editSubject, status: "Open" } : t
      )
    );
    setEditingTicket(null);
    setEditSubject("");
  };

  // 🗑️ Delete ticket
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-card">
        <div className="helpdesk-header">
          <span className="helpdesk-icon">📞</span>
          <h2>Help Desk</h2>
        </div>

        {success && <div className="helpdesk-success">{success}</div>}

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

        {/* View Old Tickets Button */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            className="view-tickets-btn"
            onClick={() => setShowTickets((prev) => !prev)}
          >
            {showTickets ? "Hide Tickets" : "📂 View Old Tickets"}
          </button>
        </div>

        {/* Ticket List */}
        {showTickets && (
          <div className="ticket-list">
            <h3>📋 My Tickets</h3>
            {tickets.length > 0 ? (
              <ul>
                {tickets.map((t) => (
                  <li
                    key={t.id}
                    className={`ticket-item ${t.status.toLowerCase()}`}
                  >
                    {editingTicket === t.id ? (
                      <div>
                        <input
                          type="text"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                        />
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(t.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingTicket(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Ticket clickable link */}
                        <Link to={`/tickets/${t.id}`} className="ticket-link">
                          <b>{t.subject}</b>
                        </Link>
                        <br />
                        <span>Status: {t.status}</span> |{" "}
                        <span>Date: {t.date}</span>
                        <div style={{ marginTop: "6px" }}>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(t)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(t.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No previous tickets found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpDesk;
