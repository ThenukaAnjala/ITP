import express from "express";
import { getGRNs, createGRN } from "../controllers/grnController.js";

const router = express.Router();

router.get("/", getGRNs);
router.post("/", createGRN);

export default router;
