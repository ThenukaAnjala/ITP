import mongoose from "mongoose";

const grnItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  received_qty: Number,
  unit_cost: Number,
});

const grnSchema = new mongoose.Schema({
  grn_no: { type: String, unique: true },
  supplier_name: String,
  grn_date: { type: Date, default: Date.now },
  items: [grnItemSchema],
  status: { type: String, enum: ["DRAFT","POSTED"], default: "DRAFT" }
}, { timestamps: true });

export default mongoose.model("GRN", grnSchema);
