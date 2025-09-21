// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE_MANAGER: "employeeManager",
  EMPLOYEE: "employee",
  INVENTORY_MANAGER: "inventoryManager",
  TICKET_MANAGER: "ticketManager",
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE,
    },
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);

