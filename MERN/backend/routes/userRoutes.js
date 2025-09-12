// routes/userRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import User, { ROLES } from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// Who can manage employees? -> ADMIN and EMPLOYEE_MANAGER
const MANAGERS = [ROLES.ADMIN, ROLES.EMPLOYEE_MANAGER];

/**
 * GET /api/users
 * list all employees (hide passwords)
 */
router.get("/", protect, authorizeRoles(...MANAGERS), async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

/**
 * PATCH /api/users/:id
 * edit firstName, lastName, role, isActive (basic needs)
 */
router.patch(
  "/:id",
  protect,
  authorizeRoles(...MANAGERS),
  [
    body("firstName").optional().isString(),
    body("lastName").optional().isString(),
    body("role").optional().isIn(Object.values(ROLES)),
    body("isActive").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const update = {};
    ["firstName", "lastName", "role", "isActive"].forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }
);

/**
 * DELETE /api/users/:id
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles(...MANAGERS),
  async (req, res) => {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed" });
  }
);

export default router;
