import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import grnRoutes from "./routes/grnRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import helpDeskRoutes from "./routes/helpDeskRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/", (_req, res) => res.send("MERN Backend API is running..."));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/grns", grnRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/helpdesk", helpDeskRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  });
