import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, authorizeRoles(ROLES.TICKET_MANAGER), getAllTickets);
router.get("/my", protect, getMyTickets);
router.patch("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

export default router;
