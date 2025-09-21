import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import helpDeskApi from "../services/helpDeskApi";
import BackButton from "../components/BackButton";
import "../styles/pages/ticketdetails.css";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = currentUser?.role === "ticketManager";

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const loadTicket = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await helpDeskApi.fetchHelpTicket(id);
      setTicket(data);
    } catch (err) {
      console.error("Failed to load ticket", err);
      setError("Unable to load ticket details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setError("");
    try {
      const updated = await helpDeskApi.sendHelpTicketMessage(id, {
        text: newMessage.trim(),
      });
      setTicket(updated);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const startEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingText(message.text);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleUpdateMessage = async () => {
    if (!editingText.trim()) return;
    setSending(true);
    setError("");
    try {
      const updated = await helpDeskApi.updateHelpTicketMessage(id, editingMessageId, {
        text: editingText.trim(),
      });
      setTicket(updated);
      cancelEdit();
    } catch (err) {
      console.error("Failed to update message", err);
      setError("Failed to update message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setSending(true);
    setError("");
    try {
      const updated = await helpDeskApi.deleteHelpTicketMessage(id, messageId);
      setTicket(updated);
    } catch (err) {
      console.error("Failed to delete message", err);
      setError("Failed to delete message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="ticketdetails-container">
        <div className="ticketdetails-card">Loading ticket...</div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticketdetails-container">
        <div className="ticketdetails-card">
          <p>{error}</p>
          <BackButton className="back-btn" includeBaseStyles={false} onClick={() => navigate(-1)}>
            Back
          </BackButton>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const status = ticket.status || "OPEN";
  const createdAt = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : "-";
  const primaryMessage = ticket.message || ticket.messages?.[0]?.text;

  return (
    <div className="ticketdetails-container">
      <div className="ticketdetails-card">
        <h2>Ticket</h2>
        <p className="ticket-id">#{ticket._id}</p>
        <p>
          <strong>Subject:</strong> {ticket.name || "Help Desk Ticket"}
        </p>
        <p>
          <strong>Status:</strong> {status.replace(/_/g, " ")} | <strong>Date:</strong> {createdAt}
        </p>
        <p>
          <strong>Initial Issue:</strong> {primaryMessage}
        </p>

        <div className="chat-box">
          <h3>Chat</h3>
          <div className="chat-messages">
            {ticket.messages && ticket.messages.length > 0 ? (
              ticket.messages.map((msg) => {
                const isOwnMessage = msg.sender === "user" ? !isManager : isManager;
                const senderLabel = msg.sender === "manager" ? "Ticket Manager" : "You";
                return (
                  <div
                    key={msg._id || msg.createdAt}
                    className={`chat-msg ${isOwnMessage ? "me" : "other"}`}
                  >
                    <div className="chat-meta">
                      <strong>{senderLabel}</strong>
                      <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
                    </div>
                    {editingMessageId === msg._id ? (
                      <div className="chat-edit">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          disabled={sending}
                        />
                        <div className="chat-actions">
                          <button onClick={handleUpdateMessage} disabled={sending || !editingText.trim()}>
                            Save
                          </button>
                          <button onClick={cancelEdit} disabled={sending}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{msg.text}</p>
                        {isManager && msg.sender === "manager" && (
                          <div className="chat-actions">
                            <button onClick={() => startEdit(msg)} disabled={sending}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteMessage(msg._id)} disabled={sending}>
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No messages yet.</p>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button onClick={handleSend} disabled={sending || !newMessage.trim()}>
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <BackButton className="back-btn" includeBaseStyles={false} onClick={() => navigate(-1)}>
          Back
        </BackButton>
      </div>
    </div>
  );
}

export default TicketDetails;
