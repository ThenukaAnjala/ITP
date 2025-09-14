import GRN from "../models/GRN.js";
import StockMovement from "../models/StockMovement.js";

export const createGRN = async (req, res) => {
  try {
    const grn = await GRN.create(req.body);

    // auto add stock movement
    for (const item of grn.items) {
      await StockMovement.create({
        item_id: item.item_id,
        qty_in: item.received_qty,
        unit_cost: item.unit_cost,
        txn_type: "GRN",
        ref_no: grn.grn_no
      });
    }

    res.status(201).json(grn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
