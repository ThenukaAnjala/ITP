import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import { getItems, createItem, updateItem, deleteItem } from "../controllers/itemController.js";

const router = express.Router();
const INVENTORY_ROLES = [ROLES.ADMIN, ROLES.INVENTORY_MANAGER];

router.get("/", protect, authorizeRoles(...INVENTORY_ROLES), getItems);
router.post("/", protect, authorizeRoles(...INVENTORY_ROLES), createItem);
router.patch("/:id", protect, authorizeRoles(...INVENTORY_ROLES), updateItem);
router.delete("/:id", protect, authorizeRoles(...INVENTORY_ROLES), deleteItem);

export default router;
