import express from "express";
import { createGRN } from "../controllers/grnController.js";

const router = express.Router();

router.post("/", createGRN);   // ➕ Create GRN

export default router;
