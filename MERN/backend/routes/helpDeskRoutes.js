import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  getMyTickets,
  addMessage,
  updateMessage,
  deleteMessage,
  updateTicket,
  deleteTicket,
} from "../controllers/helpDeskController.js";

const router = express.Router();

// Create new ticket
router.post("/", protect, createTicket);

// Ticket manager routes
router.get("/", protect, authorizeRoles(ROLES.TICKET_MANAGER), getAllTickets);
router.patch(
  "/:id/message/:messageId",
  protect,
  authorizeRoles(ROLES.TICKET_MANAGER),
  updateMessage
);
router.delete(
  "/:id/message/:messageId",
  protect,
  authorizeRoles(ROLES.TICKET_MANAGER),
  deleteMessage
);

// Get logged-in user's tickets
router.get("/my", protect, getMyTickets);

// Single ticket access (owner or ticket manager)
router.get("/:id", protect, getTicketById);

// Update ticket (owner or ticket manager)
router.patch("/:id", protect, updateTicket);

// Add message (owner or ticket manager)
router.post("/:id/message", protect, addMessage);

// Delete ticket (owner or ticket manager)
router.delete("/:id", protect, deleteTicket);

export default router;
