import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User, { ROLES } from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

const signToken = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/**
 * 1) POST /api/auth/register-admin
 * One-time Admin self-registration
 */
router.post(
  "/register-admin",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("rePassword").custom((v, { req }) => v === req.body.password),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    const existsAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (existsAdmin) {
      return res
        .status(403)
        .json({ message: "Admin already registered. Please login." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const admin = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: ROLES.ADMIN,
    });

    return res.status(201).json({
      message: "✅ Admin registered successfully. Please login now.",
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  }
);

/**
 * 2) POST /api/auth/login
 * One login screen for all roles
 */
router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);

    const byRole = {
      [ROLES.ADMIN]: "/admin",
      [ROLES.EMPLOYEE_MANAGER]: "/employee-manager",
      [ROLES.INVENTORY_MANAGER]: "/inventory",
      [ROLES.RUBBER_TAPPER]: "/tapper",
    };

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      landing: byRole[user.role] || "/",
    });
  }
);

/**
 * 3) POST /api/auth/admin/register
 * Admin creates Employee Managers
 */
router.post(
  "/admin/register",
  protect,
  authorizeRoles(ROLES.ADMIN),
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("rePassword").custom((v, { req }) => v === req.body.password),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const created = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: ROLES.EMPLOYEE_MANAGER,
    });

    res.status(201).json({
      id: created._id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      role: created.role,
    });
  }
);

export default router;
