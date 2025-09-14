import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  item_type: { type: String, enum: ["RAW","WIP","FG","MRO","PACKAGING"], required: true },
  reorder_level: Number,
  safety_stock: Number,
  standard_cost: Number,
  status: { type: String, enum: ["ACTIVE","INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
