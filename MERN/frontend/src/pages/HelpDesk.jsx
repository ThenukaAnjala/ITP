// src/pages/HelpDesk.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/helpdesk.css";
import Button from "../components/buttons/Button";
import BackButton from "../components/BackButton";
import helpDeskApi from "../services/helpDeskApi";

function HelpDesk() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    message: "",
  });

  const [tickets, setTickets] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editSubject, setEditSubject] = useState("");

  const clearAlerts = () => {
    setSuccess("");
    setError("");
  };

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await helpDeskApi.fetchMyHelpTickets();
        setTickets(data);
      } catch (err) {
        console.error("Failed to load help desk tickets", err);
        setError("Unable to load your tickets right now.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!form.message.trim()) {
      setError("Please describe your issue before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await helpDeskApi.submitHelpTicket({
        name: form.name,
        email: form.email,
        message: form.message.trim(),
      });

      setTickets((prev) => [created, ...prev]);
      setSuccess("Your help request has been submitted successfully.");
      setForm({
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        message: "",
      });
      if (!showTickets) {
        setShowTickets(true);
      }
    } catch (err) {
      console.error("Help ticket submission failed", err);
      setError("Failed to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ticket) => {
    clearAlerts();
    const id = ticket._id || ticket.id;
    setEditingTicket(id);
    setEditSubject(ticket.message || ticket.subject || "");
  };

  const handleSaveEdit = async (id) => {
    if (!editSubject.trim()) {
      setError("Please provide a message before saving.");
      return;
    }

    setActionLoadingId(`edit-${id}`);
    clearAlerts();
    try {
      const updated = await helpDeskApi.updateHelpTicket(id, {
        message: editSubject.trim(),
      });

      setTickets((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? updated : t))
      );
      setSuccess("Ticket updated successfully.");
      setEditingTicket(null);
      setEditSubject("");
    } catch (err) {
      console.error("Help ticket update failed", err);
      setError("Failed to update the ticket. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    clearAlerts();
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    setActionLoadingId(`delete-${id}`);
    try {
      await helpDeskApi.deleteHelpTicket(id);
      setTickets((prev) => prev.filter((t) => (t._id || t.id) !== id));
      setSuccess("Ticket deleted successfully.");
      if (editingTicket === id) {
        setEditingTicket(null);
        setEditSubject("");
      }
    } catch (err) {
      console.error("Help ticket delete failed", err);
      setError("Failed to delete the ticket. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderTicketSubject = (ticket) =>
    ticket.message || ticket.subject || ticket.messages?.[0]?.text || "Help request";

  const renderTicketStatus = (ticket) =>
    ticket.status ? ticket.status : "OPEN";

  const renderTicketDate = (ticket) => {
    if (ticket.createdAt) {
      return new Date(ticket.createdAt).toLocaleDateString();
    }
    if (ticket.date) return ticket.date;
    return "";
  };

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-card">
        <div className="helpdesk-top">
          <BackButton includeBaseStyles={false} className="back-btn" to="/rubber-tapper">Back</BackButton>
          <div className="helpdesk-header">
            <span className="helpdesk-icon">HD</span>
            <h2>Help Desk</h2>
          </div>
        </div>

        {error && <div className="helpdesk-error">{error}</div>}
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

          <Button type="submit" variant="primary" loading={submitting} loadingText="Submitting...">
            Submit Request
          </Button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            variant="secondary"
            className="view-tickets-btn"
            onClick={() => setShowTickets((prev) => !prev)}
            disabled={loading}
          >
            {showTickets ? "Hide Tickets" : "View My Tickets"}
          </Button>
        </div>

        {showTickets && (
          <div className="ticket-list">
            <h3>My Tickets</h3>
            {loading ? (
              <p>Loading tickets...</p>
            ) : tickets.length > 0 ? (
              <ul>
                {tickets.map((t) => {
                  const id = t._id || t.id;
                  const subject = renderTicketSubject(t);
                  const status = renderTicketStatus(t);
                  const date = renderTicketDate(t);
                  const editLoading = actionLoadingId === `edit-${id}`;
                  const deleteLoading = actionLoadingId === `delete-${id}`;
                  const statusClass = (status || "OPEN").toLowerCase();

                  return (
                    <li key={id} className={`ticket-item ${statusClass}`}>
                      {editingTicket === id ? (
                        <div>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                          />
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleSaveEdit(id)}
                            disabled={editLoading}
                            loading={editLoading}
                            loadingText="Saving..."
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTicket(null);
                              setEditSubject("");
                            }}
                            disabled={editLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Link to={`/tickets/${id}`} className="ticket-link" state={{ from: "/helpdesk" }}>
                            <b>{subject}</b>
                          </Link>
                          <br />
                          <span>Status: {status}</span>
                          {date && (
                            <>
                              {" "}| <span>Date: {date}</span>
                            </>
                          )}
                          <div style={{ marginTop: "6px" }}>
                            <Button
                              variant="subtle"
                              size="sm"
                              onClick={() => handleEdit(t)}
                              disabled={deleteLoading}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(id)}
                              disabled={deleteLoading || editLoading}
                              loading={deleteLoading}
                              loadingText="Deleting..."
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
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

