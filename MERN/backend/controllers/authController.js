import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User, { ROLES } from "../models/User.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const buildLandingRoute = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.EMPLOYEE_MANAGER:
      return "/employee-manager";
    case ROLES.INVENTORY_MANAGER:
      return "/inventory-manager";
    case ROLES.TICKET_MANAGER:
      return "/ticket-manager";
    default:
      return "/";
  }
};

const validationFailed = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid input" });
    return true;
  }
  return false;
};

export const login = async (req, res) => {
  if (validationFailed(req, res)) return;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      landing: buildLandingRoute(user.role),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: "Unable to login" });
  }
};

export const registerEmployeeManager = async (req, res) => {
  if (validationFailed(req, res)) return;

  const { firstName, lastName, email, password } = req.body;

  try {
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
  } catch (error) {
    console.error("Register employee manager failed:", error.message);
    res.status(500).json({ message: "Unable to register employee manager" });
  }
};

export const registerInitialAdmin = async (req, res) => {
  if (validationFailed(req, res)) return;

  const { firstName, lastName, email, password } = req.body;

  try {
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
  } catch (error) {
    console.error("Register admin failed:", error.message);
    res.status(500).json({ message: "Unable to register admin" });
  }
};

