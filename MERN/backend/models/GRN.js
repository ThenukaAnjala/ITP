import mongoose from "mongoose";

const grnSchema = new mongoose.Schema(
  {
    grn_no: { type: String, required: true, unique: true },
    supplier: {
      name: String,
      email: String,
    },
    grn_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["DRAFT", "POSTED"], default: "DRAFT" },
  },
  { timestamps: true }
);

export default mongoose.model("Grn", grnSchema);
