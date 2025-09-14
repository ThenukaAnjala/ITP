import Grn from "../models/GRN.js";

// ✅ Get all GRNs
export const getGRNs = async (_req, res) => {
  try {
    const grns = await Grn.find().sort({ createdAt: -1 });
    res.json(grns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
};

// ✅ Create GRN
export const createGRN = async (req, res) => {
  try {
    const { grn_no, supplier, grn_date, status } = req.body;

    const exist = await Grn.findOne({ grn_no });
    if (exist) return res.status(400).json({ message: "GRN number already exists" });

    const grn = await Grn.create({ grn_no, supplier, grn_date, status });
    res.status(201).json(grn);
  } catch (err) {
    res.status(500).json({ message: "Failed to create GRN" });
  }
};
