import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  createTask,
  getTasks,
  getMyTasks,   // ✅ New controller for Rubber Tappers
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// ✅ Create task → Employee Manager only
router.post("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), createTask);

// ✅ Get all tasks (Employee Manager)
// Example: to see all Rubber Tapper tasks
router.get("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), getTasks);

// ✅ Get logged-in Rubber Tapper’s tasks
router.get("/my", protect, authorizeRoles(ROLES.EMPLOYEE), getMyTasks);

// ✅ Update & Delete → Employee Manager only
router.patch("/:id", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), updateTask);
router.delete("/:id", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), deleteTask);

export default router;
