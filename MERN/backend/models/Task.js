import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Rubber Tapper userId
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "DONE"], default: "PENDING" },
    dueDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Employee Manager
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
