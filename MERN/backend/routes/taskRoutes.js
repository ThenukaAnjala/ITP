// src/routes/taskRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  createTask,
  getTasks,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// 🟢 Employee Manager can create tasks
router.post("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), createTask);

// 🟢 Employee Manager can view all tasks
router.get("/", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), getTasks);

// 🟢 Rubber Tapper can view only their own tasks
router.get("/my", protect, authorizeRoles(ROLES.EMPLOYEE), getMyTasks);

// 🟢 Allow both Employee + Employee Manager to update
router.patch("/:id", protect, updateTask);

// 🟢 Only Employee Manager can delete tasks
router.delete("/:id", protect, authorizeRoles(ROLES.EMPLOYEE_MANAGER), deleteTask);

export default router;
