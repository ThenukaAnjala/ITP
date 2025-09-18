import express from "express";
import { getGrns, createGrn, updateGrn, deleteGrn } from "../controllers/grnController.js";

const router = express.Router();

router.get("/", getGrns);
router.post("/", createGrn);
router.patch("/:id", updateGrn);
router.delete("/:id", deleteGrn);

export default router;
