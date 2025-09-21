// src/pages/TicketDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/pages/helpdesk.css"; // reuse styling

function TicketDetails() {
  const { id } = useParams();

  // Simulated ticket data (replace with backend call)
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // 🟢 Load ticket details (for now mock data)
    setTicket({
      id,
      subject: "Unable to start task timer",
      status: "Open",
      date: "2025-09-15",
    });

    // 🟢 Load chat history (mock)
    setMessages([
      { from: "You", text: "I can’t start my task timer." },
      { from: "Coordinator", text: "We are checking the issue now." },
    ]);
  }, [id]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages((prev) => [...prev, { from: "You", text: newMsg }]);
    setNewMsg("");
  };

  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-card">
        <h2>🎫 Ticket #{ticket.id}</h2>
        <p>
          <b>Subject:</b> {ticket.subject}
        </p>
        <p>
          <b>Status:</b> {ticket.status} | <b>Date:</b> {ticket.date}
        </p>

        {/* Chat Section */}
        <div className="chat-box">
          <h3>💬 Chat with Coordinator</h3>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === "You" ? "me" : "other"}`}>
                <b>{m.from}: </b> {m.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>

        <BackButton className="back-btn" includeBaseStyles={false}>Back</BackButton>
      </div>
    </div>
  );
}

export default TicketDetails;
