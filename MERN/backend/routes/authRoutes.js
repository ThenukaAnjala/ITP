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

// 🔑 Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      landing:
        user.role === ROLES.ADMIN
          ? "/admin"
          : user.role === ROLES.EMPLOYEE_MANAGER
          ? "/employee-manager"
          : "/",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// 🟢 Register Employee Manager (Admin only)
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
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

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

// ⚠️ TEMPORARY: Register the first Admin (remove later)
router.post(
  "/register-admin",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

    const created = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: ROLES.ADMIN,
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
