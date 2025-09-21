import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      subject,
      message,
      createdBy: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

export const getAllTickets = async (_req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "firstName lastName email role")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Get All Tickets Error:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Get My Tickets Error:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Not found" });
    res.json(ticket);
  } catch (err) {
    console.error("Update Ticket Error:", err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!ticket) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error("Delete Ticket Error:", err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

export default { createTicket, getAllTickets, getMyTickets, updateTicket, deleteTicket };
