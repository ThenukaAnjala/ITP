import HelpTicket from "../models/HelpTicket.js";
import { ROLES } from "../models/User.js";

const isTicketManager = (user) => user?.role === ROLES.TICKET_MANAGER;

const getOwnerId = (ticket) => {
  if (!ticket?.user) return null;
  if (ticket.user._id) return ticket.user._id.toString();
  return ticket.user.toString();
};

const canAccessTicket = (ticket, user) => {
  if (!ticket || !user) return false;
  const ownerId = getOwnerId(ticket);
  return ownerId === user._id.toString() || isTicketManager(user);
};

const populateTicket = (query) =>
  query.populate("user", "firstName lastName email role");

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const ticket = await HelpTicket.create({
      user: req.user._id,
      name,
      email,
      message,
      messages: [{ sender: "user", text: message }],
    });
    const populated = await populateTicket(HelpTicket.findById(ticket._id));
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Get all tickets (Ticket Manager)
export const getAllTickets = async (_req, res) => {
  try {
    const tickets = await populateTicket(HelpTicket.find()).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Get All Help Tickets Error:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Get single ticket
export const getTicketById = async (req, res) => {
  try {
    const ticket = await populateTicket(HelpTicket.findById(req.params.id));
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (!canAccessTicket(ticket, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(ticket);
  } catch (err) {
    console.error("Get Help Ticket Error:", err);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// Get My Tickets
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Update Ticket (message/status)
export const updateTicket = async (req, res) => {
  try {
    const filter = isTicketManager(req.user)
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
    const ticket = await populateTicket(
      HelpTicket.findOneAndUpdate(filter, req.body, { new: true })
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    console.error("Update Ticket Error:", err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

// Add Message to Ticket
export const addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const ticket = await HelpTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (!canAccessTicket(ticket, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const sender = isTicketManager(req.user) ? "manager" : "user";
    ticket.messages.push({ sender, text: text.trim() });
    await ticket.save();
    await ticket.populate("user", "firstName lastName email role");

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Add Help Ticket Message Error:", err);
    res.status(500).json({ message: "Failed to add message" });
  }
};

// Update message (Ticket Manager)
export const updateMessage = async (req, res) => {
  try {
    if (!isTicketManager(req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const ticket = await HelpTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const message = ticket.messages.id(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.text = text.trim();
    await ticket.save();
    await ticket.populate("user", "firstName lastName email role");

    res.json(ticket);
  } catch (err) {
    console.error("Update Help Ticket Message Error:", err);
    res.status(500).json({ message: "Failed to update message" });
  }
};

// Delete message (Ticket Manager)
export const deleteMessage = async (req, res) => {
  try {
    if (!isTicketManager(req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const ticket = await HelpTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const message = ticket.messages.id(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleteOne();
    await ticket.save();
    await ticket.populate("user", "firstName lastName email role");

    res.json(ticket);
  } catch (err) {
    console.error("Delete Help Ticket Message Error:", err);
    res.status(500).json({ message: "Failed to delete message" });
  }
};

// Delete Ticket
export const deleteTicket = async (req, res) => {
  try {
    const filter = isTicketManager(req.user)
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
    const deleted = await HelpTicket.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json({ message: "Ticket removed" });
  } catch (err) {
    console.error("Delete Ticket Error:", err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
