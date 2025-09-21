import HelpTicket from "../models/HelpTicket.js";

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
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Get all tickets (Ticket Manager)
export const getAllTickets = async (_req, res) => {
  try {
    const tickets = await HelpTicket.find()
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Get All Help Tickets Error:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
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
    const { id } = req.params;
    const { message, status } = req.body;

    const ticket = await HelpTicket.findOne({ _id: id, user: req.user._id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (typeof message === "string") {
      ticket.message = message;
      if (Array.isArray(ticket.messages) && ticket.messages.length) {
        ticket.messages[0].text = message;
      } else {
        ticket.messages = [{ sender: "user", text: message }];
      }
    }

    if (status) {
      const normalized = status.toUpperCase();
      if (["OPEN", "IN_PROGRESS", "RESOLVED"].includes(normalized)) {
        ticket.status = normalized;
      }
    }

    await ticket.save();
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
    const ticket = await HelpTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.messages.push({ sender: "user", text });
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to add message" });
  }
};

// Delete Ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HelpTicket.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json({ message: "Ticket removed" });
  } catch (err) {
    console.error("Delete Ticket Error:", err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
