import mongoose from "mongoose";

const qcInspectionSchema = new mongoose.Schema({
  ref_type: { type: String, enum: ["GRN","PROD_OUTPUT"], required: true },
  ref_id: String,
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  inspection_date: { type: Date, default: Date.now },
  result: { type: String, enum: ["PASS","REJECT","HOLD"], required: true },
  inspector: String,
  remarks: String,
}, { timestamps: true });

export default mongoose.model("QCInspection", qcInspectionSchema);
