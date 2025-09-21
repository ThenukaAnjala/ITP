import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  addMessage,
  updateTicket,
  deleteTicket,
} from "../controllers/helpDeskController.js";

const router = express.Router();

// Create new ticket
router.post("/", protect, createTicket);

// Get all tickets (Ticket Manager)
router.get("/", protect, authorizeRoles(ROLES.TICKET_MANAGER), getAllTickets);

// Get logged-in user's tickets
router.get("/my", protect, getMyTickets);

// Update ticket (message/status)
router.patch("/:id", protect, updateTicket);

// Delete ticket
router.delete("/:id", protect, deleteTicket);

// Add message to ticket
router.post("/:id/message", protect, addMessage);

export default router;
