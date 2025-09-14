import express from "express";
import { createItem, getItems } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);   // ➕ Add Item
router.get("/", getItems);      // 📦 List Items

export default router;
