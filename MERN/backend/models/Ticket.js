import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
