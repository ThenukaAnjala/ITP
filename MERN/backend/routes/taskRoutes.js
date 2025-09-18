import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

// Employee Manager only can assign tasks
router.post("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), createTask);
router.get("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), getTasks);
router.patch("/:id", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), updateTask);
router.delete("/:id", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), deleteTask);

export default router;
