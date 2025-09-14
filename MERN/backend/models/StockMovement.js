import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
  txn_date: { type: Date, default: Date.now },
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  qty_in: { type: Number, default: 0 },
  qty_out: { type: Number, default: 0 },
  unit_cost: Number,
  txn_type: { type: String, enum: ["GRN","ISSUE","ADJUSTMENT"], required: true },
  ref_no: String,
}, { timestamps: true });

export default mongoose.model("StockMovement", stockMovementSchema);
