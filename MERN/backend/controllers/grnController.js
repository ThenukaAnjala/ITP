import Grn from "../models/Grn.js";

// Get all GRNs
export const getGrns = async (_req, res) => {
  try {
    const grns = await Grn.find().sort({ createdAt: -1 });
    res.json(grns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
};

// Create GRN
export const createGrn = async (req, res) => {
  try {
    const grn = await Grn.create(req.body);
    res.status(201).json(grn);
  } catch (err) {
    res.status(500).json({ message: "Failed to create GRN" });
  }
};

// Update GRN
export const updateGrn = async (req, res) => {
  try {
    const { id } = req.params;
    const grn = await Grn.findByIdAndUpdate(id, req.body, { new: true });
    if (!grn) return res.status(404).json({ message: "GRN not found" });
    res.json(grn);
  } catch (err) {
    res.status(500).json({ message: "Failed to update GRN" });
  }
};

// Delete GRN
export const deleteGrn = async (req, res) => {
  try {
    const { id } = req.params;
    const grn = await Grn.findByIdAndDelete(id);
    if (!grn) return res.status(404).json({ message: "GRN not found" });
    res.json({ message: "GRN deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete GRN" });
  }
};
