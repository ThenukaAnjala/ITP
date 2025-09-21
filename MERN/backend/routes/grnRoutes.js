import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import { getGrns, createGrn, updateGrn, deleteGrn } from "../controllers/grnController.js";

const router = express.Router();
const INVENTORY_ROLES = [ROLES.ADMIN, ROLES.INVENTORY_MANAGER];

router.get("/", protect, authorizeRoles(...INVENTORY_ROLES), getGrns);
router.post("/", protect, authorizeRoles(...INVENTORY_ROLES), createGrn);
router.patch("/:id", protect, authorizeRoles(...INVENTORY_ROLES), updateGrn);
router.delete("/:id", protect, authorizeRoles(...INVENTORY_ROLES), deleteGrn);

export default router;
