import express from "express";
import { body, validationResult } from "express-validator";
import User, { ROLES } from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const MANAGERS = [ROLES.ADMIN, ROLES.EMPLOYEE_MANAGER];

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Admin + Employee Manager
 */
router.get("/", protect, authorizeRoles(...MANAGERS), async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * @desc Register new user (Employee, Inventory Manager, Supplier Manager)
 * @route POST /api/users
 * @access Admin + Employee Manager
 */
router.post(
  "/",
  protect,
  authorizeRoles(...MANAGERS),
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn([
      ROLES.EMPLOYEE,
      ROLES.INVENTORY_MANAGER,
      ROLES.SUPPLIER_MANAGER,
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });
    }

    try {
      const { firstName, lastName, email, password, role } = req.body;

      // duplicate check
      const exist = await User.findOne({ email });
      if (exist) return res.status(400).json({ message: "Email already exists" });

      // hash password
      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashed,
        role,
      });

      res.status(201).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to register user" });
    }
  }
);

/**
 * @desc Update user
 * @route PATCH /api/users/:id
 * @access Admin + Employee Manager
 */
router.patch("/:id", protect, authorizeRoles(...MANAGERS), async (req, res) => {
  try {
    const update = req.body;

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

/**
 * @desc Delete user
 * @route DELETE /api/users/:id
 * @access Admin + Employee Manager
 */
router.delete("/:id", protect, authorizeRoles(...MANAGERS), async (req, res) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
