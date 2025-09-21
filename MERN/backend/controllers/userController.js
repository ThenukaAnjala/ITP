import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const validationFailed = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid input" });
    return true;
  }
  return false;
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users failed:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const registerUser = async (req, res) => {
  if (validationFailed(req, res)) return;

  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const created = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    res.status(201).json({
      id: created._id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      role: created.role,
    });
  } catch (error) {
    console.error("Register user failed:", error.message);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update user failed:", error.message);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User removed" });
  } catch (error) {
    console.error("Delete user failed:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
