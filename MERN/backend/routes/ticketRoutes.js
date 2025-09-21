import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createTicket,
  getMyTickets,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.patch("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

export default router;
