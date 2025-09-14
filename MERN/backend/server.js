import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ New imports for Inventory Management
import itemRoutes from "./routes/itemRoutes.js";
import grnRoutes from "./routes/grnRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/", (_req, res) => res.send("✅ MERN Backend API is running..."));

// wire routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Inventory management endpoints
app.use("/api/items", itemRoutes);
app.use("/api/grns", grnRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });
