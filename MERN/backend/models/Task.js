import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    action: { type: String, enum: ["START", "PAUSE", "STOP"], required: true },
    at: { type: Date, default: Date.now }, // ✅ this should auto-save timestamp
  },
  { _id: false }
);


const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Rubber Tapper
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "DONE"],
      default: "PENDING",
    },

    dueDate: { type: Date },

    // Employee Manager
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🆕 Job history
    history: [historySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
