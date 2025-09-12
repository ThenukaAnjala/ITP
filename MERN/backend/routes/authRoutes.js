// routes/authRoutes.js
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
 * POST /api/auth/login   (ONE login screen for all)
 * body: { email, password }
 * returns: { token, user:{...}, landing:'/admin' | '/employee-manager' | ... }
 */
router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);

    // role → landing path (frontend use this to navigate)
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
 * POST /api/auth/admin/register   (ADMIN-only registration page)
 * Admin creates new users — for your spec we’ll create Employee Managers.
 * body: { firstName, lastName, email, password, rePassword }
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
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const created = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: ROLES.EMPLOYEE_MANAGER, // per requirement: admin registers employee managers
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
