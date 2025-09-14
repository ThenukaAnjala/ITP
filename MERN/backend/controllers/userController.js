import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Get all users (no password)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Register new user (Admin → Managers / Manager → Employees etc.)
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // check duplicate email
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role, // "employeeManager", "employee", "inventoryManager", "supplierManager"
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
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
      "-password"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
