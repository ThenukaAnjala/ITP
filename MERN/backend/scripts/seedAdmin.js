import dotenv from "dotenv";
import mongoose from "mongoose";
import User, { ROLES } from "../models/User.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "admin@factory.com";
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      firstName: "Factory",
      lastName: "Admin",
      email,
      password: "Admin#12345",
      role: ROLES.ADMIN,
    });
    console.log("✅ Admin created:", email, "/ Admin#12345");
  } else {
    console.log("ℹ️ Admin already exists:", email);
  }
  await mongoose.disconnect();
};
run();
