import HelpTicket from "../models/HelpTicket.js";

// ➕ Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const ticket = await HelpTicket.create({
      user: req.user._id,
      name,
      email,
      message,
      messages: [{ sender: "user", text: message }]
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// 📋 Get My Tickets
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find({ user: req.user._id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// 💬 Add Message to Ticket
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
