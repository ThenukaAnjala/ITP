import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import helpDeskApi from "../services/helpDeskApi";
import "../styles/pages/ticketmanager.css";

function TicketManagerLanding() {
  const manager = JSON.parse(localStorage.getItem("user") || "{}");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await helpDeskApi.fetchAllHelpTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load help desk tickets", err);
      setError("Unable to load help desk tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const managerName = manager?.firstName
    ? `${manager.firstName} ${manager.lastName || ""}`.trim()
    : "";

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  const renderOwner = (ticket) => {
    if (ticket?.name) return ticket.name;
    if (ticket?.user) {
      const { firstName, lastName, email } = ticket.user;
      const name = [firstName, lastName].filter(Boolean).join(" ");
      return name || email || "Unknown";
    }
    return ticket?.email || "Unknown";
  };

  const renderStatus = (status) =>
    (status || "OPEN").replace(/_/g, " ");

  const statusClass = (status) => {
    const value = (status || "OPEN").toLowerCase();
    if (value === "resolved") return "ticket-status-resolved";
    if (value === "in_progress") return "ticket-status-open";
    return "ticket-status-open";
  };

  return (
    <div className="ticket-manager-wrap">
      <header className="ticket-manager-header">
        <div>
          <h1>Ticket Manager Dashboard</h1>
          <p>
            {managerName
              ? `Hello ${managerName}, here are the latest help desk tickets.`
              : "Welcome!"}
          </p>
        </div>
        <button
          className="ticket-refresh"
          onClick={loadTickets}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && <div className="ticket-manager-error">{error}</div>}

      <section className="ticket-manager-card">
        <h2>Help Desk Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets available yet.</p>
        ) : (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Employee</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.name || "Help Desk Ticket"}</td>
                  <td>{ticket.message}</td>
                  <td className={statusClass(ticket.status)}>{renderStatus(ticket.status)}</td>
                  <td>{renderOwner(ticket)}</td>
                  <td>{formatDate(ticket.createdAt)}</td>
                  <td>
                    <Link className="ticket-link" to={`/tickets/${ticket._id}`} state={{ from: "/ticket-manager" }}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default TicketManagerLanding;
