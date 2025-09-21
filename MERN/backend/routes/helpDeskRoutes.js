import express from "express";
import { protect } from "../middleware/auth.js";
import { createTicket, getMyTickets, addMessage } from "../controllers/helpDeskController.js";

const router = express.Router();

// Create new ticket
router.post("/", protect, createTicket);

// Get logged-in user’s tickets
router.get("/my", protect, getMyTickets);

// Add message to ticket
router.post("/:id/message", protect, addMessage);

export default router;
